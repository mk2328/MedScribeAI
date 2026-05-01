from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import httpx, os, datetime, requests as http_req
from database import engine, get_db, Base
import models, schemas
from auth import get_password_hash, verify_password

# Initialize Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MedScribe AI Professional API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ══════════════════════════════════════════════════════════════
#   COLAB URL — reads from Supabase app_config table
#   No hardcoding needed! Colab auto-saves URL on every start.
# ══════════════════════════════════════════════════════════════

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://dcuscebijrddltgragcb.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")  # set as env var

def get_colab_url() -> str:
    """
    Fetches Colab ngrok URL from Supabase app_config table.
    Falls back to COLAB_URL env var if Supabase fetch fails.
    """
    try:
        res = http_req.get(
            f"{SUPABASE_URL}/rest/v1/app_config?key=eq.colab_url&select=value",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
            },
            timeout=5
        )
        if res.status_code == 200:
            data = res.json()
            if data and data[0].get("value"):
                return data[0]["value"].rstrip("/")
    except Exception as e:
        print(f"⚠️  Could not fetch Colab URL from Supabase: {e}")

    # Fallback to env var
    fallback = os.environ.get("COLAB_URL", "")
    if fallback:
        return fallback.rstrip("/")
    
    raise ValueError(
        "Colab URL not found. Start Colab server — it will auto-save the URL to Supabase."
    )


# ══════════════════════════════════════════════════════════════
#   AUTH ENDPOINTS
# ══════════════════════════════════════════════════════════════

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
            "name": user.name,
            "email": user.email,
            "role": user.role.lower()
        }
    }


# ══════════════════════════════════════════════════════════════
#   ADMIN ENDPOINTS
# ══════════════════════════════════════════════════════════════

@app.post("/admin/add-doctor")
def add_doctor(doctor_in: schemas.DoctorCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == doctor_in.user_data.email).first()
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
        "status": "success",
        "message": "Doctor created successfully",
        "doctor_id": new_doctor.doctor_id,
        "user_id": new_user.user_id
    }


@app.post("/admin/add-receptionist")
def add_receptionist(recept_in: schemas.ReceptionistCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == recept_in.user_data.email).first()
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

    return {"status": "success", "message": "Receptionist profile created securely"}


@app.get("/doctors", response_model=List[schemas.DoctorResponse])
def get_doctors(db: Session = Depends(get_db)):
    return db.query(models.Doctor).all()


# ══════════════════════════════════════════════════════════════
#   AUDIO PROCESSING — BACKGROUND TASK
#   Fetches Colab URL from Supabase dynamically each time.
#   Updates DB status after each pipeline step.
# ══════════════════════════════════════════════════════════════

async def call_colab_in_background(consultation_id: int, audio_url: str, audio_file_path: str):
    """
    Runs in background — React Native gets immediate response.
    Colab processes audio and updates DB status after each step.
    App polls /consultation/{id}/status to show live progress.
    """
    from database import SessionLocal
    db = SessionLocal()

    try:
        # Set status to processing before calling Colab
        consultation = db.query(models.Consultation).filter(
            models.Consultation.consultation_id == consultation_id
        ).first()
        if consultation:
            consultation.status = "processing"
            consultation.updated_at = datetime.datetime.utcnow()
            db.commit()

        # Fetch Colab URL from Supabase
        try:
            colab_url = get_colab_url()
        except ValueError as e:
            raise RuntimeError(str(e))

        print(f"📡 Calling Colab at: {colab_url}/process")

        # Call Colab — it updates DB status internally after each step
        # Timeout 15 min (full pipeline can take time)
        async with httpx.AsyncClient(timeout=900.0) as client:
            response = await client.post(
                f"{colab_url}/process",
                json={
                    "audio_url": audio_url,
                    "record_id": str(consultation_id),
                    "bucket_path": audio_file_path,
                }
            )
            response.raise_for_status()
            result = response.json()

        # Colab already updated status in DB directly.
        # We just verify and do a final sync here as safety net.
        db.refresh(consultation)
        if consultation and consultation.status != "completed":
            consultation.status = "completed"
            consultation.soap_note = result.get("soap_note", "")
            consultation.transcript = result.get("transcript", "")
            consultation.updated_at = datetime.datetime.utcnow()
            db.commit()

            # Save to soap_reports table as well
            existing_report = db.query(models.SOAPReport).filter(
                models.SOAPReport.consultation_id == consultation_id
            ).first()
            soap_text = result.get("soap_note", "")
            if existing_report:
                existing_report.full_soap_note = soap_text
                existing_report.generated_at = datetime.datetime.utcnow()
            else:
                db.add(models.SOAPReport(
                    consultation_id=consultation_id,
                    full_soap_note=soap_text,
                    subjective="See full_soap_note",
                    objective="See full_soap_note",
                    assessment="See full_soap_note",
                    plan="See full_soap_note",
                ))
            db.commit()

    except httpx.TimeoutException:
        db.refresh(consultation)
        if consultation:
            consultation.status = "error"
            consultation.error_message = "Colab pipeline timeout (>15 min) — try a shorter audio file"
            consultation.updated_at = datetime.datetime.utcnow()
            db.commit()

    except Exception as e:
        print(f"❌ Background task error: {e}")
        try:
            db.refresh(consultation)
            if consultation:
                consultation.status = "error"
                consultation.error_message = str(e)
                consultation.updated_at = datetime.datetime.utcnow()
                db.commit()
        except Exception:
            pass

    finally:
        db.close()


@app.post("/consultation/process-audio")
async def process_audio(
    request: schemas.AudioProcessRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    React Native calls this after Supabase audio upload.
    Returns consultation_id immediately — processing runs in background.
    Poll GET /consultation/{id}/status for live step updates.
    """
    new_consultation = models.Consultation(
        appointment_id=None,
        doctor_id=request.doctor_id,
        audio_recording_url=request.audio_url,
        audio_file_path=request.audio_file_path,
        file_name=request.file_name,
        status="queued",
    )
    db.add(new_consultation)
    db.commit()
    db.refresh(new_consultation)

    consultation_id = new_consultation.consultation_id

    background_tasks.add_task(
        call_colab_in_background,
        consultation_id=consultation_id,
        audio_url=request.audio_url,
        audio_file_path=request.audio_file_path,
    )

    return {
        "status": "queued",
        "consultation_id": consultation_id,
        "message": "Processing queued — poll /consultation/{id}/status for live updates",
    }


@app.get("/consultation/{consultation_id}/status")
def get_consultation_status(consultation_id: int, db: Session = Depends(get_db)):
    """
    React Native polls this every 5s for live step-by-step progress.
    Returns current pipeline step so app can show it in UI.

    Status values: queued | processing | cleaning | transcribing |
                   labeling | correcting | generating | auditing |
                   completed | error
    """
    consultation = db.query(models.Consultation).filter(
        models.Consultation.consultation_id == consultation_id
    ).first()

    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    response = {
        "consultation_id": consultation_id,
        "status": consultation.status,
        "file_name": consultation.file_name,
        "created_at": consultation.created_at,
        "updated_at": consultation.updated_at,
        "error_message": consultation.error_message,
    }

    if consultation.status == "completed":
        response["soap_note"] = consultation.soap_note
        response["transcript"] = consultation.transcript

    return response


@app.get("/consultation/{consultation_id}/soap")
def get_soap_report(consultation_id: int, db: Session = Depends(get_db)):
    consultation = db.query(models.Consultation).filter(
        models.Consultation.consultation_id == consultation_id
    ).first()

    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    if consultation.status != "completed":
        raise HTTPException(
            status_code=202,
            detail=f"Processing is {consultation.status} — try again later"
        )

    return {
        "consultation_id": consultation_id,
        "status": "completed",
        "soap_note": consultation.soap_note,
        "transcript": consultation.transcript,
        "file_name": consultation.file_name,
        "created_at": consultation.created_at,
    }


@app.get("/doctor/{doctor_id}/consultations")
def get_doctor_consultations(doctor_id: int, db: Session = Depends(get_db)):
    consultations = db.query(models.Consultation).filter(
        models.Consultation.doctor_id == doctor_id
    ).order_by(models.Consultation.created_at.desc()).all()

    return [
        {
            "consultation_id": c.consultation_id,
            "file_name": c.file_name,
            "status": c.status,
            "created_at": c.created_at,
            "has_soap": c.soap_note is not None,
        }
        for c in consultations
    ]


# ── TEMPORARY: CREATE INITIAL ADMIN ──
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

    return {
        "message": "Admin created successfully!",
        "email": "admin@medscribe.com",
        "password": "admin786"
    }