from fastapi import FastAPI, Request, Response, status
from services.questionService import QuestionService
from services.topicService import TopicService
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
def insertQuestion(questionData: Question, res: Response):
    try:
        questionData = questionData.model_dump()  # convert back to dict

        addQuestion = questionService.insert_question(questionData)
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


@app.get("/fetchQuestions")
def fetchAllQuestions(res: Response):
    try:
        getAllQuestions = questionService.fetch_all_questions()
        if getAllQuestions.get("fetched"):
            res.status_code = status.HTTP_200_OK
            print(getAllQuestions)
            return {"message": "Questions fetched", "questions": getAllQuestions.get("questions")}
    except Exception:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "Server error"}


@app.get("/fetchQuestions/{questionID}")
def fetchQuestion(questionID: int, res: Response):
    try:
        getQuestion = questionService.fetch_question(questionID)
        if getQuestion.get("fetched"):
            res.status_code = status.HTTP_200_OK
            return {"message": "Question fetched", "question": getQuestion.get("question")}
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": getQuestion.get("error")}
    except Exception:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "Server error"}


@app.put("/updateQuestion/{questionID}")
def updateQuestion(questionID: int, questionData: Question, res: Response):
    try:
        questionData = questionData.model_dump()

        questionData["id"] = questionID

        updateQuestion = questionService.update_question(questionData)

        if updateQuestion.get("updated"):
            res.status_code = status.HTTP_200_OK
            return {"message": "Question updated", "question": updateQuestion.get("question")}
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": updateQuestion.get("error")}
    except ValidationError:
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "Missing or invalid fields"}
    except Exception as e:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "Server error", "detail": str(e)}


@app.delete("/deleteQuestion/{questionID}")
def deleteQuestion(questionID: int, res: Response):
    try:
        deleteQuestion = questionService.delete_question(questionID)

        if deleteQuestion.get("deleted"):
            res.status_code = status.HTTP_202_ACCEPTED
            return {"message": "Question deleted"}
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": deleteQuestion.get("error")}
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
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": newTopic.get("error")}
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
    uvicorn.run("main:app", port=5002, reload=True)