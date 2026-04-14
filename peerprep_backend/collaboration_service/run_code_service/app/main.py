from fastapi import FastAPI
import socketio
from fastapi.middleware.cors import CORSMiddleware

from .routers.runCode import runCodeRouter

app = FastAPI(title="PeerPrep Collaboration Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=["http://localhost:3000"]
)

socket_app = socketio.ASGIApp(sio, app)
app.include_router(runCodeRouter)