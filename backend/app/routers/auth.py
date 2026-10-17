import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..config import settings
from ..database import get_db
from ..security import (
    create_access_token,
    generate_reset_token,
    hash_password,
    verify_password,
    verify_google_token,
)
from ..services.email_service import send_password_reset_email
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

class GoogleSignInRequest(BaseModel):
    credential: str


@router.post("/signup", response_model=schemas.TokenResponse)
def sign_up(payload: schemas.SignUpRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    user = models.User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id)
    return schemas.TokenResponse(access_token=token)


@router.post("/signin", response_model=schemas.TokenResponse)
def sign_in(payload: schemas.SignInRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()

    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password.",
    )

    if not user or not verify_password(payload.password, user.hashed_password):
        raise invalid_credentials

    token = create_access_token(subject=user.id)
    return schemas.TokenResponse(access_token=token)


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password(payload: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()

    if user:
        token = generate_reset_token()
        reset_token = models.PasswordResetToken(
            user_id=user.id,
            token=token,
            expires_at=datetime.utcnow() + timedelta(minutes=30),
        )
        db.add(reset_token)
        db.commit()

        reset_link = f"{settings.frontend_url}/reset-password?token={token}"
        send_password_reset_email(to_email=user.email, reset_link=reset_link)

    return {"message": "If that email is registered, a reset link has been sent."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(payload: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    reset_token = (
        db.query(models.PasswordResetToken)
        .filter(models.PasswordResetToken.token == payload.token)
        .first()
    )

    invalid_token_error = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="This reset link is invalid or has expired.",
    )

    if not reset_token:
        raise invalid_token_error
    if reset_token.used:
        raise invalid_token_error
    if reset_token.expires_at < datetime.utcnow():
        raise invalid_token_error

    user = db.query(models.User).filter(models.User.id == reset_token.user_id).first()
    if not user:
        raise invalid_token_error

    user.hashed_password = hash_password(payload.new_password)
    reset_token.used = True
    db.commit()

    return {"message": "Password has been reset. You can now sign in."}

@router.post("/google", response_model=schemas.TokenResponse)
def google_sign_in(
    payload: GoogleSignInRequest,
    db: Session = Depends(get_db),
):
    try:
        google_user = verify_google_token(payload.credential)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google authentication.",
        )

    google_email = google_user.get("email")
    first_name = google_user.get("given_name", "")
    last_name = google_user.get("family_name", "")

    if not google_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account email could not be verified.",
        )

    if not google_user.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your Google email address is not verified.",
        )

    user = (
        db.query(models.User)
        .filter(models.User.email == google_email)
        .first()
    )

    if not user:
        user = models.User(
            first_name=first_name or "Google",
            last_name=last_name or "User",
            email=google_email,
            hashed_password=hash_password(
                secrets.token_urlsafe(32)
            ),
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(subject=user.id)

    return schemas.TokenResponse(access_token=token)