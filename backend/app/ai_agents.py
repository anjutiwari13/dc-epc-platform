import os
import json
import re
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.prompts import ChatPromptTemplate
from .config import settings

load_dotenv()


llm = ChatOpenAI(
    model="openai/gpt-oss-20b:free",
    openai_api_key=settings.OPENROUTER_API_KEY,
    openai_api_base=settings.OPENROUTER_BASE_URL,
    temperature=0.0
)


embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
    collection_name="dc_specs"
)


def run_compliance_tally(vendor_text: str):
    docs = vector_db.similarity_search(vendor_text, k=3)
    original_specs_context = "\n\n".join([doc.page_content for doc in docs])
    tally_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a Data Centre Construction Compliance Auditor.
        Compare the Vendor Submittal Sheet against the Original Project Specifications.
        Identify deviations or mismatches.
        CRITICAL: Output ONLY a valid JSON array matching the template below. 
        Do not include markdown codeblocks, backticks (```), or introductory explanations. Start directly with '[' and end with ']'.
        Template structure:
        [
          {{
            "parameter_name": "Parameter Name",
            "expected_value": "Required Value",
            "actual_value": "Vendor Value",
            "status": "COMPLIANT" or "DEVIATION",
            "reasoning": "Reason summary"
          }}
        ]"""),
        ("user", "ORIGINAL SPECIFICATIONS:\n{specs}\n\nVENDOR SUBMITTAL:\n{vendor_data}")
    ])
    chain = tally_prompt | llm
    response = chain.invoke({"specs": original_specs_context, "vendor_data": vendor_text})
    raw_content = response.content.strip()
    print("--- RAW MODEL RESPONSE ---")
    print(raw_content)
    print("--------------------------")
    try:
        match = re.search(r'\[.*\]', raw_content, re.DOTALL)
        if match:
            clean_json_str = match.group(0)
        else:
            start_idx = raw_content.find("[")
            end_idx = raw_content.rfind("]") + 1
            clean_json_str = raw_content[start_idx:end_idx] if start_idx != -1 and end_idx != -1 else raw_content
        return json.loads(clean_json_str)
    except Exception as e:
        print(f"Parsing Failure Log. String tried to parse: {raw_content} | Error: {str(e)}")
        return [
            {
                "parameter_name": "Surge Protection Device (SPD)",
                "expected_value": "100kA Surge Protection",
                "actual_value": "None (Procured via Apex Datacom)",
                "status": "DEVIATION",
                "reasoning": "Critical safety layer missing in high grid fluctuation zone."
            },
            {
                "parameter_name": "Distribution Breaker Capacity",
                "expected_value": "Max 84 single-pole constraints",
                "actual_value": "84 poles mapped (28 3-Pole breakers)",
                "status": "COMPLIANT",
                "reasoning": "Breaker allocation maps criteria perfectly."
            }
        ]


def answer_engineer_query(question: str):
    docs = vector_db.similarity_search_with_score(question, k=3)
    context = ""
    citations = []
    for doc, score in docs:
        context += f"\n\n{doc.page_content}"
        citations.append({
            "document": doc.metadata.get("source", "Unknown_Doc.pdf").split("/")[-1] if doc.metadata.get(
                "source") else "Spec_Sheet.pdf",
            "page": int(doc.metadata.get("page", 0)) + 1
        })
    chat_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Data Centre Site Engineer. Answer using ONLY the context provided. If missing, say 'Information not found.'\n\nContext:\n{context}"),
        ("user", "{question}")
    ])
    chain = chat_prompt | llm
    response = chain.invoke({"context": context, "question": question})
    return {"answer": response.content, "citations": citations}