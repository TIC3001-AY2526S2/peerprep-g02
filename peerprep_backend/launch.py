from fastapi import FastAPI
import uvicorn
import asyncio
from user_service.app.routers.user import UserRouter
from question_service.app.routers.question import QuestionRouter

appUserService = FastAPI(title="PeerPrep User Service")
appUserService.include_router(UserRouter)
appQuestionService = FastAPI(title="PeerPrep Question Service")
appQuestionService.include_router(QuestionRouter)

async def run_user_service():
    config = uvicorn.Config(appUserService, host="0.0.0.0", port=5000, reload=True, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()

async def run_question_service():
    config = uvicorn.Config(appQuestionService, host="0.0.0.0", port=5001, reload=True, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()

async def main():
    await asyncio.gather(run_user_service(), run_question_service())

if __name__ == "__main__":
    asyncio.run(main())