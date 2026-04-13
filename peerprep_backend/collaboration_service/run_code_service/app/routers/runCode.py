from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json

from ..services.runCodeService import RunCodeService

runCodeRouter = APIRouter()

class RunCodeRequest(BaseModel):
    user_code: str
    question_id: int


@runCodeRouter.post("/run")
async def run_code(request: RunCodeRequest):
    try:
        with open("questions.json", "r") as f:
            questions = json.load(f)

        question = next((q for q in questions if q["id"] == request.question_id), None)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        service = RunCodeService(question)
        return await service.run(request.user_code)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))