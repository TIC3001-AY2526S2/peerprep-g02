import os
import hashlib
import re
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext

SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_ME_TO_ENV_VAR")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 2

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def sha256_hash(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()

EMAIL_REGEX = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
PASSWORD_REGEX = r"^(?=.*[a-z])(?=.*[A-Z]).{8,}$"

def validate_email(email: str) -> bool:
    return re.match(EMAIL_REGEX, email) is not None

def validate_password(password: str) -> bool:
    return re.match(PASSWORD_REGEX, password) is not None

def create_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)}   # fixed datetime.utcnow() deprecation
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None
