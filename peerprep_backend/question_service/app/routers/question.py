from fastapi import APIRouter, Response, Request, status
from ..services.questionService import QuestionService
from ..services.topicService import TopicService
from ..models.question import Question
from pydantic import ValidationError

QuestionRouter = APIRouter(tags=["Questions"])

questionService = QuestionService()
topicService = TopicService()

@QuestionRouter.post("/newQuestion")
def insertQuestion(questionData: Question, res: Response):
    print("Received question data:", questionData) #Log request
    try:
        questionData = questionData.model_dump()  # convert back to dict

        addQuestion = questionService.insert_question(questionData)
        if addQuestion.get("insert") == True:
            res.status_code = status.HTTP_201_CREATED
            return {"message": "Question added", "question": addQuestion.get("question")}
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": addQuestion.get("message")}
    except ValidationError:
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "Missing or invalid fields"}
    except Exception as e:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": str(e)}

@QuestionRouter.get("/fetchQuestions")
def fetchAllQuestions(res: Response):
    try:
        fetchAllQuestions = questionService.fetch_all_questions()
        if fetchAllQuestions.get("fetched"):
            res.status_code = status.HTTP_200_OK
            return {"message": "Questions fetched", "questions": fetchAllQuestions.get("questions")}
    except Exception:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "Server error"}


@QuestionRouter.get("/fetchQuestion/{questionID}")
def fetchQuestion(questionID: str, res: Response):
    try:
        fetchQuestion = questionService.fetch_question(questionID)
        if fetchQuestion.get("fetched"):
            res.status_code = status.HTTP_200_OK
            return {"message": "Question fetched", "question": fetchQuestion.get("question")}
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": fetchQuestion.get("error")}
    except Exception:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "Server error"}


@QuestionRouter.put("/updateQuestion/{questionID}")
def updateQuestion(questionID: str, questionData: Question, res: Response):
    try:
        questionData = questionData.model_dump()

        questionData["_id"] = questionID

        updateQuestion = questionService.update_question(questionData)
        if updateQuestion.get("updated"):
            res.status_code = status.HTTP_200_OK
            return {"message": "Question updated", "question": updateQuestion.get("question")}
        return {"message": updateQuestion.get("error")}
    except ValidationError:
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "Missing or invalid fields"}
    except Exception as e:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "Server error", "detail": str(e)}


@QuestionRouter.delete("/deleteQuestion/{questionID}")
def deleteQuestion(questionID: str, res: Response, request: Request):
    role = request.headers.get("X-User-Role")
    username = request.headers.get("X-Username")
    print(f"Delete requested by {username} with role {role}")
    try:
        deleteQuestion = questionService.delete_question(questionID)

        if deleteQuestion.get("deleted"):
            res.status_code = status.HTTP_202_ACCEPTED
            return {"message": "Question deleted"}
        res.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": deleteQuestion.get("error")}
    except Exception as e:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "Server error", "detail": str(e)}

@QuestionRouter.post("/newTopic/{topic}")
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


@QuestionRouter.get("/topics")
def allTopics(res: Response):
    try:
        topics = topicService.available_topics()
        res.status_code = status.HTTP_200_OK
        return {"topics": topics}
    except Exception as e:
        return {"error": str(e)}