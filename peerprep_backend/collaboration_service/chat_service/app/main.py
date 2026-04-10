from fastapi import FastAPI
import socketio
from fastapi.middleware.cors import CORSMiddleware

from .routers.chat import sio

app = FastAPI(title="PeerPrep Chat Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

socket_app = socketio.ASGIApp(sio, app)