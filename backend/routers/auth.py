import os
import secrets

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from services.auth_service import create_token

router = APIRouter()


class LoginRequest(BaseModel):
    password: str


class TokenResponse(BaseModel):
    token: str


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    admin_password = os.getenv("ADMIN_PASSWORD", "")
    if not admin_password:
        raise HTTPException(status_code=500, detail="ADMIN_PASSWORD not configured")
    if not secrets.compare_digest(body.password, admin_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
    return TokenResponse(token=create_token())
