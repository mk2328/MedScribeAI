from database import engine

with engine.connect() as conn:
    conn.execute("""
        ALTER TABLE consultations ADD COLUMN IF NOT EXISTS doctor_id INTEGER;
        ALTER TABLE consultations ADD COLUMN IF NOT EXISTS appointment_id INTEGER;
        ALTER TABLE consultations ADD COLUMN IF NOT EXISTS processing_step VARCHAR;
        ALTER TABLE consultations ADD COLUMN IF NOT EXISTS progress_message TEXT;
        ALTER TABLE consultations ADD COLUMN IF NOT EXISTS progress_percent INTEGER DEFAULT 0;
        ALTER TABLE consultations ADD COLUMN IF NOT EXISTS corrected_transcript TEXT;
        ALTER TABLE consultations ADD COLUMN IF NOT EXISTS error_message TEXT;
    """)
    conn.commit()
    print("Migration complete!")