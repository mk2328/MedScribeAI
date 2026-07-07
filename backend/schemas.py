from pydantic import BaseModel
from typing import Optional
import datetime


# ── Auth & User Schemas ──────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class UserCreate(BaseModel):
    name: str
    email: str
    username: str
    password: str
    phone: Optional[str] = None


class DoctorCreate(BaseModel):
    user_data: UserCreate
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    availability_status: Optional[str] = "available"


class ReceptionistCreate(BaseModel):
    user_data: UserCreate


class DoctorResponse(BaseModel):
    doctor_id: int
    user_id: int
    specialization: Optional[str]
    experience_years: Optional[int]
    availability_status: Optional[str]

    class Config:
        from_attributes = True


# ── Audio Processing Schemas ─────────────────────────────────

class AudioProcessRequest(BaseModel):
    audio_url: str
    audio_file_path: str
    file_name: str
    doctor_id: Optional[int] = None


class ConsultationStatusResponse(BaseModel):
    consultation_id: int
    status: str
    file_name: Optional[str] = None
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None
    error_message: Optional[str] = None
    soap_note: Optional[str] = None
    transcript: Optional[str] = None
    processing_step: Optional[str] = None
    progress_message: Optional[str] = None
    progress_percent: Optional[int] = 0

    class Config:
        from_attributes = True


class ConsultationSoapResponse(BaseModel):
    consultation_id: int
    status: str
    soap_note: Optional[str] = None
    transcript: Optional[str] = None
    file_name: Optional[str] = None
    created_at: Optional[datetime.datetime] = None


class ApproveSOAPRequest(BaseModel):
    approved_soap: str
    doctor_id: Optional[int] = None

# ── Patient / Receptionist Schemas ───────────────────────────

class PatientRegister(BaseModel):
    name: str
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    department: Optional[str] = None
    assigned_doctor_id: Optional[int] = None
    registered_by: Optional[int] = None  # receptionist_id


class PatientResponse(BaseModel):
    patient_id: int
    name: str
    patient_code: Optional[str]
    department: Optional[str]
    status: Optional[str]
    created_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True


class DashboardStatsResponse(BaseModel):
    registered_today: int
    in_queue: int
    appointments_today: int
    avg_wait_minutes: Optional[int] = None

class QueuePatientResponse(BaseModel):
    patient_id: int
    patient_code: Optional[str]
    name: str
    age: Optional[int]
    gender: Optional[str]
    department: Optional[str]
    status: Optional[str]
    doctor_name: Optional[str] = None
    created_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

class PatientListResponse(BaseModel):
    patient_id: int
    name: str
    patient_code: Optional[str]
    age: Optional[int]
    phone: Optional[str]
    department: Optional[str]
    status: Optional[str]
    created_at: Optional[datetime.datetime]
    visit_count: int = 0

    class Config:
        from_attributes = True