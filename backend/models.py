from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)
    phone = Column(String(20))
    role = Column(String(50), nullable=False) # admin, doctor, patient, receptionist
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    patient_profile = relationship("Patient", back_populates="user", uselist=False)
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)
    receptionist_profile = relationship("Receptionist", back_populates="user", uselist=False) # Added this

# --- Naya Receptionist Table ---
class Receptionist(Base):
    __tablename__ = "receptionists"
    receptionist_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    
    user = relationship("User", back_populates="receptionist_profile")

class Patient(Base):
    __tablename__ = "patients"
    patient_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    age = Column(Integer)
    gender = Column(String(20))
    marital_status = Column(String(50))

    user = relationship("User", back_populates="patient_profile")
    appointments = relationship("Appointment", back_populates="patient")

class Doctor(Base):
    __tablename__ = "doctors"
    doctor_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    specialization = Column(String(255))
    experience_years = Column(Integer)
    availability_status = Column(String(50), default="available")

    user = relationship("User", back_populates="doctor_profile")
    appointments = relationship("Appointment", back_populates="doctor")

class Appointment(Base):
    __tablename__ = "appointments"
    appointment_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    doctor_id = Column(Integer, ForeignKey("doctors.doctor_id"))
    scheduled_time = Column(DateTime)
    status = Column(String(50)) 
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    consultation = relationship("Consultation", back_populates="appointment", uselist=False)

class Consultation(Base):
    __tablename__ = "consultations"
    consultation_id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(Integer, ForeignKey("appointments.appointment_id"))
    audio_recording_url = Column(String(255))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    appointment = relationship("Appointment", back_populates="consultation")
    transcription = relationship("Transcription", back_populates="consultation", uselist=False)
    soap_report = relationship("SOAPReport", back_populates="consultation", uselist=False)

class Transcription(Base):
    __tablename__ = "transcriptions"
    transcription_id = Column(Integer, primary_key=True, index=True)
    consultation_id = Column(Integer, ForeignKey("consultations.consultation_id"))
    full_text = Column(Text)
    doctor_text = Column(Text)
    patient_text = Column(Text)

    consultation = relationship("Consultation", back_populates="transcription")

class SOAPReport(Base):
    __tablename__ = "soap_reports"
    soap_id = Column(Integer, primary_key=True, index=True)
    consultation_id = Column(Integer, ForeignKey("consultations.consultation_id"))
    subjective = Column(Text)
    objective = Column(Text)
    assessment = Column(Text)
    plan = Column(Text)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

    consultation = relationship("Consultation", back_populates="soap_report")

# Medical Documents Table (For Future AI Search)
class MedicalDocument(Base):
    __tablename__ = "medical_documents"
    doc_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    content = Column(Text)
    source = Column(String(255))