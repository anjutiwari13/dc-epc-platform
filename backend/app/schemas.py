# schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ComplianceLogSchema(BaseModel):
    parameter_name: str
    expected_value: str
    actual_value: str
    status: str
    reasoning: Optional[str] = None

    class Config:
        from_attributes = True

class VendorSubmittalSchema(BaseModel):
    id: int
    vendor_name: str
    equipment_type: str
    file_path: str
    uploaded_at: datetime
    logs: List[ComplianceLogSchema]

    class Config:
        from_attributes = True