from fastapi import APIRouter, HTTPException, Depends, Header
from ..models.user import RegisterRequest, LoginRequest, UpdateProfileRequest
from ..services.auth import (
    validate_email,
    validate_password,
    verify_password,
    create_token,
    decode_token
)
from ..services.userService import UserService

UserRouter = APIRouter(tags=["Users"])
userService = UserService()

@UserRouter.post("/register")
def register(data: RegisterRequest):
    if not validate_email(data.email):
        raise HTTPException(400, "Invalid email format")

    if not validate_password(data.password):
        raise HTTPException(
            400,
            "Password must contain upper & lower case letters and be ≥ 8 chars"
        )

    if userService.get_user_by_email(data.email):
        raise HTTPException(400, "Email already exists")

    userService.create_user(data.email, data.password, data.username)
    return {"message": "User registered successfully"}

@UserRouter.post("/login")
def login(data: LoginRequest):
    user = userService.get_user_by_email(data.email)
    if not user:
        raise HTTPException(404, "Email not found")

    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(401, "Incorrect password")

    token = create_token(user["user_id"])
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
    userService.update_username(userId, data.username)
    return {"message": "Profile updated"}