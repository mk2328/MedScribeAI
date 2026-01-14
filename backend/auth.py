from passlib.context import CryptContext

# Bcrypt algorithm ka setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 1. Plain password ko hash karne ke liye (Jab user create hoga)
def get_password_hash(password):
    return pwd_context.hash(password)

# 2. Login ke waqt password verify karne ke liye
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)