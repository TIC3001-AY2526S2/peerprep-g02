from fastapi import FastAPI

from .routers.question import QuestionRouter

app = FastAPI(title="PeerPrep Question Service")

app.include_router(QuestionRouter)