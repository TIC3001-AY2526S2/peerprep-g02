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

    token = create_token(user["user_id"], role=user.get("role", "user"))
    return {"token": token, "user":{"username": user["username"], "role": user["role"], "user_id": user["user_id"]}}

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Please log in")

    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Invalid authorization header")

    token = authorization.split(" ")[1]
    userId = decode_token(token)

    if not userId:
        raise HTTPException(401, "Invalid token")

    return userId

@UserRouter.get("/user/{user_id}")
def get_user(user_id: str):
    user = userService.get_user_by_user_id(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return {
        "username": user["username"],
        "email": user.get("email", ""),
        "role": user["role"]
    }

@UserRouter.get("/profile")
def get_profile(userId: str = Depends(get_current_user)):
    user = userService.get_user_by_user_id(userId)
    if not user:
        raise HTTPException(404, "User not found")
    return {
        "username": user["username"],
        "email": user.get("email", ""),
        "role": user.get("role", "user")
    }

@UserRouter.put("/profile")
def update_profile(
    data: UpdateProfileRequest,
    userId: str = Depends(get_current_user)
):
    user = userService.get_user_by_user_id(userId)
    if not user:
        raise HTTPException(404, "User not found")

    if data.newPassword:
        if not data.currentPassword:
            raise HTTPException(400, "Current password required")
        if not verify_password(data.currentPassword, user["password_hash"]):
            raise HTTPException(401, "Incorrect current password")
        if verify_password(data.newPassword, user["password_hash"]):
            raise HTTPException(400, "New password cannot be the same as old password")
        if not validate_password(data.newPassword):
            raise HTTPException(
                400,
                "Password must contain upper & lower case letters and be ≥ 8 chars"
            )
    try:
        userService.update_profile(
            userId,
            username=data.username,
            email=data.email,
            password=data.newPassword
        )
        return {"message": "Profile updated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))