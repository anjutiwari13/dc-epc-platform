import os
import shutil
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from . import models
from .ai_pipeline import ingest_specification_pdf
from .ai_agents import run_compliance_tally, answer_engineer_query

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI EPC Data Centre Project Platform Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/v1/specs/upload", status_code=201)
async def upload_specs(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    temp_path = f"./temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    chunks_created = ingest_specification_pdf(temp_path, collection_name="dc_specs")
    os.remove(temp_path)
    db_spec = models.ProjectSpec(doc_name=file.filename)
    db.add(db_spec)
    db.commit()
    return {
        "status": "success",
        "message": f"Ingested {chunks_created} vectors to ChromaDB & logged to Postgres."
    }


@app.post("/api/v1/compliance/verify")
async def verify_submittal(
        file: UploadFile = File(...),
        vendor_name: str = Form(...),
        equipment_type: str = Form(...),
        db: Session = Depends(get_db)
):
    temp_path = f"./temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    from langchain_community.document_loaders import PyPDFLoader
    loader = PyPDFLoader(temp_path)
    vendor_docs = loader.load()
    vendor_text = " ".join([d.page_content for d in vendor_docs])
    os.remove(temp_path)
    tally_results = run_compliance_tally(vendor_text)
    has_deviation = any(item.get('status') == 'DEVIATION' for item in tally_results)
    final_status = "DEVIATION_DETECTED" if has_deviation else "100%_COMPLIANT"
    db_submittal = models.VendorSubmittal(
        vendor_name=vendor_name,
        equipment_type=equipment_type,
        file_path=file.filename
    )
    db.add(db_submittal)
    db.flush()
    for item in tally_results:
        db_log = models.ComplianceLog(
            submittal_id=db_submittal.id,
            parameter_name=item.get('parameter_name', 'N/A'),
            expected_value=item.get('expected_value', 'N/A'),
            actual_value=item.get('actual_value', 'N/A'),
            status=item.get('status', 'DEVIATION'),
            reasoning=item.get('reasoning', 'Evaluated against specs.')
        )
        db.add(db_log)
    db.commit()
    return {
        "submittal_id": db_submittal.id,
        "vendor_name": vendor_name,
        "status": final_status,
        "audit_logs": tally_results
    }


@app.post("/api/v1/chat/query")
async def chat_query(question: str):
    return answer_engineer_query(question)


@app.get("/api/v1/dashboard/history")
def get_history(db: Session = Depends(get_db)):
    submittals = db.query(models.VendorSubmittal).all()
    output = []
    for s in submittals:
        output.append({
            "id": s.id,
            "submittal_id": s.id,
            "vendor_name": s.vendor_name,
            "equipment_type": s.equipment_type,
            "uploaded_at": s.uploaded_at,
            # FIXED: Entire compliance log fields exported here
            "logs": [
                {
                    "id": l.id,
                    "parameter_name": l.parameter_name,
                    "expected_value": l.expected_value,
                    "actual_value": l.actual_value,
                    "status": l.status,
                    "reasoning": l.reasoning
                }
                for l in s.logs
            ]
        })
    return {
        "records_count": len(submittals),
        "data": output
    }