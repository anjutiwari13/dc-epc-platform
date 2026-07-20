# 🚀 DC-EPC Pro: AI-Powered Data Centre Compliance & Engineering Auditor

**DC-EPC Pro** is an enterprise-grade AI solution engineered to automate the technical compliance auditing of Data Centre Engineering, Procurement, and Construction (EPC) equipment submittals (e.g., Remote Power Panels, Switchgears, Chillers).

Built with **FastAPI, React (Vite), LangChain, ChromaDB**, and hybrid inference LLM architecture (**Ollama / OpenRouter**), it eliminates manual verification errors by instantly processing multipage PDFs, extracting critical parameters, and generating detailed compliance matrices paired with AI justification traces.

---

## 👥 Team & Submission Details

* **Team Name:** `anjutiwari350`
* **Team Members:** Anju Tiwari & Prerit Srivastava
---

## ✨ Key Features

1. **Automated Multi-Parameter Extraction:** Parses complex PDF tables to extract continuous ratings, kAIC interrupting capacity, voltage classes, LSI trip settings, and physical dimensions.
2. **Context-Aware Compliance Matrix:** Compares vendor datasheets directly against baseline RFP specifications, flagging `COMPLIANT` vs. `DEVIATION DETECTED`.
3. **Transparent AI Justification Traces:** Provides line-by-line engineering justifications for every flagged metric.
4. **Engineer AI Chatbot:** Interactive RAG-powered assistant to query ingested RFP specifications using natural language.
5. **Hybrid LLM Pipeline:** Supports both local private inference via **Ollama** and cloud-scale inference via **OpenRouter API**.

---

## 🛠️ Tech Stack

### **Backend**
* **Framework:** Python, FastAPI
* **Orchestration:** LangChain
* **Embeddings:** HuggingFace Local Embeddings
* **Vector Store:** ChromaDB
* **LLM Engine:** OpenRouter API / Ollama
* **PDF Processing:** PDFPlumber, PyPDF

### **Frontend**
* **Framework:** React.js (Vite)
* **Styling:** TailwindCSS
* **Icons & State:** Lucide Icons, Axios

---

## 📁 Repository Structure

```text
dc-epc-platform/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── ai_agents.py        # LangChain agent workflows
│   │   ├── ai_pipeline.py      # PDF parsing & RAG ingestion
│   │   ├── config.py           # App settings & env loader
│   │   ├── database.py        # Database connectors
│   │   ├── main.py            # FastAPI endpoints
│   │   ├── models.py          # ORM Data Models
│   │   └── schemas.py         # Pydantic Schemas
│   ├── chroma_db/             # Local Vector Store (Ignored in Git)
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # API Keys (Ignored in Git)
│
├── frontend/
│   ├── src/
│   │   ├── assets/            # Static media
│   │   ├── components/        # Reusable UI components (Sidebar, Layout)
│   │   ├── pages/             # App pages (Dashboard, Audit, Upload, ChatBot)
│   │   ├── services/          # Axios API bridge
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore# dc-epc-platform