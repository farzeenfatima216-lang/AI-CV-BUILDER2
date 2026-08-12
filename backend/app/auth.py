import logging
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from . import models
from .database import get_db

logger = logging.getLogger("resume-builder.auth")

SECRET_KEY = "dev-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256", "bcrypt"],
    default="pbkdf2_sha256",
    deprecated="auto",
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not isinstance(plain_password, str) or plain_password == "":
        logger.warning("Invalid plain password value for verification")
        return False
    try:
        result = pwd_context.verify(plain_password, hashed_password)
        logger.debug("verify_password result=%s", result)
        return result
    except Exception:
        logger.exception("Error verifying password")
        return False


def get_password_hash(password: str) -> str:
    if not isinstance(password, str) or password == "":
        logger.error("Attempted to hash invalid password type/value")
        raise ValueError("Password must be a non-empty string")
    if len(password) > 128:
        logger.error("Attempted to hash overly long password of length %s", len(password))
        raise ValueError("Password must be 128 characters or fewer")

    try:
        hashed = pwd_context.hash(password)
        logger.debug("Generated password hash of length=%s", len(hashed))
        return hashed
    except Exception:
        logger.exception("Failed to hash password")
        raise


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user
