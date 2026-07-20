from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class ProjectSpec(Base):
    __tablename__ = "project_specs"
    id = Column(Integer, primary_key=True, index=True)
    doc_name = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)


class VendorSubmittal(Base):
    __tablename__ = "vendor_submittals"
    id = Column(Integer, primary_key=True, index=True)
    vendor_name = Column(String, nullable=False)
    equipment_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    logs = relationship("ComplianceLog", back_populates="submittal")


class ComplianceLog(Base):
    __tablename__ = "compliance_logs"
    id = Column(Integer, primary_key=True, index=True)
    submittal_id = Column(Integer, ForeignKey("vendor_submittals.id"))
    parameter_name = Column(String, nullable=False)
    expected_value = Column(String, nullable=False)
    actual_value = Column(String, nullable=False)
    status = Column(String, nullable=False)  # COMPLIANT / DEVIATION
    reasoning = Column(String, nullable=True)
    submittal = relationship("VendorSubmittal", back_populates="logs")