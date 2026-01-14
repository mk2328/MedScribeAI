from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware # CORS ke liye
from sqlalchemy.orm import Session
from typing import List
from database import engine, get_db, Base
import models, schemas
from auth import get_password_hash, verify_password

# Initialize Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MedScribe AI Professional API")

# --- CORS MIDDLEWARE (Zaroori hai React Native connection ke liye) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Real app mein yahan sirf mobile ki IP de sakte hain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. LOGIN ENDPOINT ---
@app.post("/login")
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Email not registered")

    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Login successful
    return {
        "status": "success",
        "user": {
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "role": user.role.lower() # Lowercase taake frontend logic asaan ho
        }
    }

# --- 2. ADMIN: ADD DOCTOR ---
@app.post("/admin/add-doctor")
def add_doctor(doctor_in: schemas.DoctorCreate, db: Session = Depends(get_db)):
    # Check if email exists
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
        experience_years=doctor_in.experience_years
    )
    db.add(new_doctor)
    db.commit()
    
    return {"status": "success", "message": "Doctor profile created securely"}

# --- 3. ADMIN: ADD RECEPTIONIST ---
@app.post("/admin/add-receptionist")
def add_receptionist(recept_in: schemas.ReceptionistCreate, db: Session = Depends(get_db)):
    # Check if email exists
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

# --- 4. LIST DOCTORS ---
@app.get("/doctors", response_model=List[schemas.DoctorResponse])
def get_doctors(db: Session = Depends(get_db)):
    return db.query(models.Doctor).all()


# --- TEMPORARY: CREATE INITIAL ADMIN ---
@app.post("/setup/create-admin")
def create_initial_admin(db: Session = Depends(get_db)):
    # Check if admin already exists
    admin_exists = db.query(models.User).filter(models.User.role == "admin").first()
    if admin_exists:
        return {"message": "Admin already exists"}

    hashed_pwd = get_password_hash("admin786") # Aapka password yahan set hoga
    
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
    
    return {"message": "Admin created successfully!", "email": "admin@medscribe.com", "password": "admin786"}