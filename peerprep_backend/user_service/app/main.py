from fastapi import FastAPI

from .routers.user import UserRouter

app = FastAPI(title="PeerPrep User Service")

app.include_router(UserRouter)