from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.user import UserRouter

app = FastAPI(title="PeerPrep User Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1;3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(UserRouter)