from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: EmailStr
    username: str
    phone: Optional[str] = None
    role: Optional[str] = None

    @field_validator('username')
    @classmethod
    def username_no_spaces(cls, v: str) -> str:
        return v.replace(' ', '_').lower()

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Login Schema ---
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# --- Receptionist Schemas ---
class ReceptionistCreate(BaseModel):
    user_data: UserCreate

class ReceptionistResponse(BaseModel):
    receptionist_id: int
    user: UserResponse

    class Config:
        from_attributes = True

# --- Doctor Schemas ---
class DoctorBase(BaseModel):
    specialization: str
    experience_years: int
    availability_status: Optional[str] = "available"

class DoctorCreate(DoctorBase):
    user_data: UserCreate
    specialization: str
    experience_years: int

class DoctorResponse(DoctorBase):
    doctor_id: int
    user: UserResponse

    class Config:
        from_attributes = True

# --- Appointment & Consultation Schemas ---
class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    scheduled_time: datetime
    status: str = "pending"

class ConsultationResponse(BaseModel):
    consultation_id: int
    appointment_id: int
    audio_recording_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# --- SOAP & Transcription Schemas ---
class SOAPResponse(BaseModel):
    soap_id: int
    subjective: str
    objective: str
    assessment: str
    plan: str

    class Config:
        from_attributes = True