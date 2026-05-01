from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import httpx, os, datetime, re
from database import engine, get_db, Base
import models, schemas
from auth import get_password_hash, verify_password

# Initialize Database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MedScribe AI Professional API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ====================== SOAP PARSER HELPERS ======================

def clean_markdown(text: str) -> str:
    """
    ## headings, **bold**, *italic* symbols remove karo — content preserve karo.
    """
    if not text:
        return text
    # Remove ### heading markers
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    # Remove **bold** and __bold__ markers (keep inner text)
    text = re.sub(r'\*{1,2}([^*\n]+)\*{1,2}', r'\1', text)
    text = re.sub(r'_{1,2}([^_\n]+)_{1,2}', r'\1', text)
    # Cleanup extra blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def parse_soap_sections(soap_text: str) -> dict:
    """
    SOAP note text ko parse karke S, O, A, P alag fields mein extract karo.
    Returns dict with keys: subjective, objective, assessment, plan

    Handles formats:
      - **Subjective**:   Subjective:   SUBJECTIVE:
      - ### FINAL OUTPUT: **S** - Subjective:   (AI preamble format)
      - S - Subjective:   O - Objective:
      - Simple: Subjective\n content...
    """
    sections = {
        "subjective": "",
        "objective":  "",
        "assessment": "",
        "plan":       "",
    }

    # Unified header regex:
    # Matches entire header line regardless of preamble (###, FINAL OUTPUT, etc.)
    # Captures section name: Subjective / Objective / Assessment / Plan
    header_re = re.compile(
        r'(?:^|\n)'                                          # line start
        r'[^\n]*?'                                           # optional preamble
        r'\*{0,2}'                                           # optional **
        r'(Subjective|Objective|Assessment|Plan)'            # section keyword
        r'\*{0,2}'                                           # optional **
        r'[^\n]*'                                            # rest of header (colon, dash, etc.)
        r'\n',                                               # end of header line
        re.IGNORECASE
    )

    matches = list(header_re.finditer(soap_text))

    for i, match in enumerate(matches):
        section_name = match.group(1).lower()
        content_start = match.end()
        content_end = matches[i + 1].start() if i + 1 < len(matches) else len(soap_text)
        content = soap_text[content_start:content_end].strip()
        sections[section_name] = clean_markdown(content)

    # Fallback: agar koi section parse nahi hua, sara text subjective mein
    if not any(sections.values()):
        sections["subjective"] = clean_markdown(soap_text.strip())

    return sections


# ====================== AUTH & ADMIN ENDPOINTS ======================

@app.post("/login")
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Email not registered")
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password")

    return {
        "status": "success",
        "user": {
            "user_id": user.user_id,
            "name":    user.name,
            "email":   user.email,
            "role":    user.role.lower()
        }
    }


@app.post("/admin/add-doctor")
def add_doctor(doctor_in: schemas.DoctorCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        models.User.email == doctor_in.user_data.email
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = get_password_hash(doctor_in.user_data.password)

    new_user = models.User(
        name=doctor_in.user_data.name,
        email=doctor_in.user_data.email,
        username=doctor_in.user_data.username,
        password_hash=hashed_pwd,
        phone=doctor_in.user_data.phone,
        role="doctor"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_doctor = models.Doctor(
        user_id=new_user.user_id,
        specialization=doctor_in.specialization,
        experience_years=doctor_in.experience_years,
        availability_status=doctor_in.availability_status
    )
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)

    return {
        "status":    "success",
        "message":   "Doctor created successfully",
        "doctor_id": new_doctor.doctor_id,
        "user_id":   new_user.user_id
    }


@app.post("/admin/add-receptionist")
def add_receptionist(recept_in: schemas.ReceptionistCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        models.User.email == recept_in.user_data.email
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = get_password_hash(recept_in.user_data.password)

    new_user = models.User(
        name=recept_in.user_data.name,
        email=recept_in.user_data.email,
        username=recept_in.user_data.username,
        password_hash=hashed_pwd,
        phone=recept_in.user_data.phone,
        role="receptionist"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_recept = models.Receptionist(user_id=new_user.user_id)
    db.add(new_recept)
    db.commit()

    return {"status": "success", "message": "Receptionist profile created successfully"}


@app.get("/doctors", response_model=List[schemas.DoctorResponse])
def get_doctors(db: Session = Depends(get_db)):
    return db.query(models.Doctor).all()


# ====================== HELPER: Get Latest Colab URL ======================

def get_colab_url():
    return "https://unwell-duller-handshake.ngrok-free.dev"
    """Fetch latest ngrok URL from Supabase app_config table"""
    try:
        from supabase import create_client
        SUPABASE_URL = os.environ.get("SUPABASE_URL")
        SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
        if SUPABASE_URL and SUPABASE_KEY:
            supa = create_client(SUPABASE_URL, SUPABASE_KEY)
            response = supa.table("app_config").select("value").eq("key", "colab_url").execute()
            if response.data and len(response.data) > 0:
                return response.data[0]["value"]
    except Exception as e:
        print(f"Warning: Could not fetch colab_url from DB: {e}")

    return os.environ.get("COLAB_URL", "https://XXXX.ngrok-free.app")


# ====================== AUDIO PROCESSING ======================

async def call_colab_in_background(consultation_id: int, audio_url: str, bucket_path: str):
    from database import SessionLocal
    db = SessionLocal()

    COLAB_URL = get_colab_url()
    print(f"🔥 Task started: {consultation_id}")
    print(f"🔥 Colab URL: {COLAB_URL}")
    print(f"🔥 Audio URL: {audio_url}")

    consultation = None
    try:
        consultation = db.query(models.Consultation).filter(
            models.Consultation.consultation_id == consultation_id
        ).first()

        if consultation:
            consultation.status           = "processing"
            consultation.processing_step  = "started"
            consultation.progress_message = "Connecting to AI pipeline..."
            consultation.updated_at       = datetime.datetime.utcnow()
            db.commit()

        async with httpx.AsyncClient(timeout=900.0) as client:
            response = await client.post(
                f"{COLAB_URL}/process",
                json={
                    "audio_url":   audio_url,
                    "record_id":   str(consultation_id),
                    "bucket_path": bucket_path
                },
                timeout=900.0
            )
            response.raise_for_status()

    except httpx.TimeoutException:
        if consultation:
            consultation.status        = "error"
            consultation.error_message = "Processing timeout - Colab took too long"
            consultation.updated_at    = datetime.datetime.utcnow()
            db.commit()

    except Exception as e:
        error_msg = str(e)
        print(f"Colab call failed: {error_msg}")
        if consultation:
            consultation.status        = "error"
            consultation.error_message = error_msg
            consultation.updated_at    = datetime.datetime.utcnow()
            db.commit()

    finally:
        db.close()


@app.post("/consultation/process-audio")
async def process_audio(
    request: schemas.AudioProcessRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    new_consultation = models.Consultation(
        appointment_id=None,
        doctor_id=request.doctor_id,
        audio_recording_url=request.audio_url,
        audio_file_path=request.audio_file_path,
        file_name=request.file_name,
        status="queued",
        processing_step="queued",
        progress_message="Queued for processing",
    )
    db.add(new_consultation)
    db.commit()
    db.refresh(new_consultation)

    background_tasks.add_task(
        call_colab_in_background,
        consultation_id=new_consultation.consultation_id,
        audio_url=request.audio_url,
        bucket_path=request.audio_file_path
    )

    return {
        "status":          "queued",
        "consultation_id": new_consultation.consultation_id,
        "message":         "Audio queued successfully. Processing will start shortly."
    }


@app.get("/consultation/{consultation_id}/status")
def get_consultation_status(consultation_id: int, db: Session = Depends(get_db)):
    consultation = db.query(models.Consultation).filter(
        models.Consultation.consultation_id == consultation_id
    ).first()

    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    response = {
        "consultation_id":  consultation.consultation_id,
        "status":           consultation.status,
        "file_name":        consultation.file_name,
        "created_at":       consultation.created_at,
        "updated_at":       consultation.updated_at,
        "error_message":    consultation.error_message,
        "processing_step":  getattr(consultation, 'processing_step', None),
        "progress_message": getattr(consultation, 'progress_message', None),
        "progress_percent": getattr(consultation, 'progress_percent', 0),
    }

    if consultation.status in ("pending_approval", "completed", "rejected"):
        response["soap_note"]  = consultation.soap_note
        response["transcript"] = consultation.transcript

    return response


@app.get("/consultation/{consultation_id}/soap")
def get_soap_note(consultation_id: int, db: Session = Depends(get_db)):
    consultation = db.query(models.Consultation).filter(
        models.Consultation.consultation_id == consultation_id
    ).first()

    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    if consultation.status != "completed":
        raise HTTPException(
            status_code=202,
            detail=f"Still processing: {consultation.status}"
        )

    return {
        "consultation_id": consultation.consultation_id,
        "status":          consultation.status,
        "soap_note":       consultation.soap_note,
        "transcript":      consultation.transcript,
        "file_name":       consultation.file_name,
        "created_at":      consultation.created_at,
    }


@app.get("/consultation/{consultation_id}/soap-report")
def get_soap_report_detail(consultation_id: int, db: Session = Depends(get_db)):
    """
    soap_reports table se parsed S/O/A/P sections return karo.
    Doctor dashboard ke liye — structured alag-alag fields mein.
    """
    report = db.query(models.SOAPReport).filter(
        models.SOAPReport.consultation_id == consultation_id
    ).first()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="SOAP report not found. Consultation abhi approved nahi hua ya exist nahi karta."
        )

    return {
        "soap_id":         report.soap_id,
        "consultation_id": report.consultation_id,
        "subjective":      report.subjective,
        "objective":       report.objective,
        "assessment":      report.assessment,
        "plan":            report.plan,
        "full_soap_note":  report.full_soap_note,
        "generated_at":    report.generated_at,
    }


# ====================== DOCTOR APPROVE / REJECT ENDPOINTS ======================

@app.post("/consultation/{consultation_id}/approve")
def approve_soap_note(
    consultation_id: int,
    request: schemas.ApproveSOAPRequest,
    db: Session = Depends(get_db)
):
    """
    Doctor SOAP note review/edit karta hai phir approve karta hai.

    Steps:
      1. consultations table  → status='completed', soap_note=doctor ka final version
      2. parse_soap_sections  → S, O, A, P text extract karo (markdown cleaned)
      3. soap_reports table   → UPSERT (update if exists, insert if new)
    All in one DB transaction.
    """
    # ── 1. Fetch consultation ───────────────────────────────────────────────
    consultation = db.query(models.Consultation).filter(
        models.Consultation.consultation_id == consultation_id
    ).first()

    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    if consultation.status not in ("pending_approval", "completed"):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot approve — current status is: {consultation.status}"
        )

    # ── 2. Update consultations table ──────────────────────────────────────
    final_soap = request.approved_soap
    consultation.status           = "completed"
    consultation.soap_note        = final_soap
    consultation.processing_step  = "completed"
    consultation.progress_message = "SOAP Note approved by doctor ✅"
    if request.doctor_id:
        consultation.doctor_id = request.doctor_id
    consultation.updated_at = datetime.datetime.utcnow()

    # ── 3. Parse SOAP text into S / O / A / P (with markdown cleanup) ──────
    parsed = parse_soap_sections(final_soap)

    # ── 4. Upsert soap_reports table ───────────────────────────────────────
    existing_report = db.query(models.SOAPReport).filter(
        models.SOAPReport.consultation_id == consultation_id
    ).first()

    if existing_report:
        existing_report.subjective     = parsed["subjective"]
        existing_report.objective      = parsed["objective"]
        existing_report.assessment     = parsed["assessment"]
        existing_report.plan           = parsed["plan"]
        existing_report.full_soap_note = final_soap
        existing_report.generated_at   = datetime.datetime.utcnow()
        print(f"✅ soap_reports UPDATED  — consultation_id={consultation_id}")
    else:
        new_report = models.SOAPReport(
            consultation_id=consultation_id,
            subjective=parsed["subjective"],
            objective=parsed["objective"],
            assessment=parsed["assessment"],
            plan=parsed["plan"],
            full_soap_note=final_soap,
            generated_at=datetime.datetime.utcnow(),
        )
        db.add(new_report)
        print(f"✅ soap_reports INSERTED — consultation_id={consultation_id}")

    # ── 5. Commit both tables in one transaction ────────────────────────────
    db.commit()

    return {
        "status":          "completed",
        "consultation_id": consultation_id,
        "message":         "SOAP note approved, finalized, and saved to soap_reports ✅",
        "soap_sections": {
            "subjective": parsed["subjective"],
            "objective":  parsed["objective"],
            "assessment": parsed["assessment"],
            "plan":       parsed["plan"],
        }
    }


@app.post("/consultation/{consultation_id}/reject")
def reject_soap_note(
    consultation_id: int,
    reason: Optional[str] = "",
    db: Session = Depends(get_db)
):
    """
    Doctor ne SOAP note reject kia — status = 'rejected'.
    """
    consultation = db.query(models.Consultation).filter(
        models.Consultation.consultation_id == consultation_id
    ).first()

    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    consultation.status           = "rejected"
    consultation.processing_step  = "rejected"
    consultation.progress_message = f"Rejected by doctor: {reason or 'No reason given'}"
    consultation.error_message    = reason or "Doctor rejected this SOAP note"
    consultation.updated_at       = datetime.datetime.utcnow()
    db.commit()

    return {
        "status":          "rejected",
        "consultation_id": consultation_id,
        "message":         "SOAP note rejected."
    }


@app.get("/doctor/{doctor_id}/consultations")
def get_doctor_consultations(doctor_id: int, db: Session = Depends(get_db)):
    consultations = db.query(models.Consultation).filter(
        models.Consultation.doctor_id == doctor_id
    ).order_by(models.Consultation.created_at.desc()).all()

    return [
        {
            "consultation_id": c.consultation_id,
            "file_name":       c.file_name,
            "status":          c.status,
            "created_at":      c.created_at,
            "has_soap":        c.soap_note is not None,
        }
        for c in consultations
    ]


# ====================== TEMPORARY ADMIN SETUP ======================

@app.post("/setup/create-admin")
def create_initial_admin(db: Session = Depends(get_db)):
    admin_exists = db.query(models.User).filter(models.User.role == "admin").first()
    if admin_exists:
        return {"message": "Admin already exists"}

    hashed_pwd = get_password_hash("admin786")

    new_admin = models.User(
        name="System Admin",
        email="admin@medscribe.com",
        username="admin",
        password_hash=hashed_pwd,
        phone="0000000000",
        role="admin"
    )
    db.add(new_admin)
    db.commit()

    return {"message": "Admin created!", "email": "admin@medscribe.com", "password": "admin786"}