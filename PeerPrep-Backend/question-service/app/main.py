from fastapi import FastAPI, Request, Response, status
from app.services.questionService import QuestionService
from app.services.topicService import TopicService
from pydantic import BaseModel, ConfigDict, ValidationError
from typing import List, Literal
import uvicorn

app = FastAPI()

questionService = QuestionService()
topicService = TopicService()

class Question(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    description: str
    category: List[str]
    complexity: Literal["easy", "medium", "hard"]

@app.post("/newQuestion")
async def insertQuestion(req: Request, res: Response):
    questionData = await req.json()
    try:
        questionData = Question(**questionData) # convert to BaseModel to validate fields
        questionData = questionData.model_dump() # convert back to dict

        addQuestion = await questionService.insert_question(questionData)
        if addQuestion.get("insert"):
            res.status_code = status.HTTP_201_CREATED
            return {"message": "Question added", "question": addQuestion.get("question")}
        return {"message": addQuestion.get("error")}
    except ValidationError:
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "Missing or invalid fields"}
    except Exception:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "Server error"}

@app.put("/updateQuestion/{questionID}")
async def updateQuestion(questionID: int, req: Request, res: Response):
    questionData = await req.json()
    try:
        questionData = Question(**questionData)
        questionData = questionData.model_dump()

        questionData["id"] = questionID

        updateQuestion = questionService.update_question(questionData)
        
        if updateQuestion.get("updated"):
            res.status_code = status.HTTP_200_OK
            return{"message": "Question updated", "question": updateQuestion.get("question")}
        
        raise Exception
    except ValidationError:
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "Missing or invalid fields"}
    except Exception as e:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "Server error", "detail": str(e)}

@app.post("/newTopic/{topic}")
def newTopic(topic: str, res: Response):
    try:
        newTopic = topicService.create_topic(topic)
        if newTopic.get("insert"):
            res.status_code = status.HTTP_201_CREATED
            return {"message": "Topic created", "topic": newTopic}
        raise Exception
    except Exception as e:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "Server error", "detail": str(e)}

@app.get("/topics")
def allTopics(res: Response):
    try:
        topics = topicService.available_topics()
        res.status_code = status.HTTP_200_OK
        return {"topics": topics}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run("app.main:app", port=5002, reload=True)