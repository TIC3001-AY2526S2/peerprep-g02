from fastapi import APIRouter, HTTPException, Depends, Header
from ..models.user import RegisterRequest, LoginRequest, UpdateProfileRequest
from ..services.auth import (
    validate_email,
    validate_password,
    verify_password,
    create_token,
    decode_token
)

UserRouter = APIRouter(prefix="/users", tags=["Users"])

@UserRouter.post("/register")
def register(data: RegisterRequest):
    if not validate_email(data.email):
        raise HTTPException(400, "Invalid email format")

    if not validate_password(data.password):
        raise HTTPException(
            400,
            "Password must contain upper & lower case letters and be ≥ 8 chars"
        )

    if get_user_by_email(data.email):
        raise HTTPException(400, "Email already exists")

    create_user(data.email, data.password, data.username)
    return {"message": "User registered successfully"}

@UserRouter.post("/login")
def login(data: LoginRequest):
    user = get_user_by_email(data.email)
    if not user:
        raise HTTPException(404, "Email not found")

    if not verify_password(data.password, user["passwordHash"]):
        raise HTTPException(401, "Incorrect password")

    token = create_token(user["userId"])
    return {"token": token}

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Please log in")

    userId = decode_token(authorization)
    if not userId:
        raise HTTPException(401, "Invalid token")

    return userId

@UserRouter.put("/profile")
def update_profile(
    data: UpdateProfileRequest,
    userId: str = Depends(get_current_user)
):
    update_username(userId, data.username)
    return {"message": "Profile updated"}