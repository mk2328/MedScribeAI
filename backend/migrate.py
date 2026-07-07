from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("""
        ALTER TABLE patients ADD COLUMN IF NOT EXISTS name VARCHAR(255);
        ALTER TABLE patients ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
        ALTER TABLE patients ADD COLUMN IF NOT EXISTS patient_code VARCHAR(50) UNIQUE;
        ALTER TABLE patients ADD COLUMN IF NOT EXISTS department VARCHAR(255);
        ALTER TABLE patients ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'waiting';
        ALTER TABLE patients ADD COLUMN IF NOT EXISTS assigned_doctor_id INTEGER;
        ALTER TABLE patients ADD COLUMN IF NOT EXISTS registered_by INTEGER;
        ALTER TABLE patients ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
    """))
    conn.commit()
    print("Patients table migration complete!")