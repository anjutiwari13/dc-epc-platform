from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings  # FIXED: Local Free Embeddings
from langchain_community.vectorstores import Chroma
import os

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


def ingest_specification_pdf(file_path: str, collection_name: str):
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_documents(documents)
    persist_directory = "./chroma_db"
    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_directory,
        collection_name=collection_name
    )
    return len(chunks)