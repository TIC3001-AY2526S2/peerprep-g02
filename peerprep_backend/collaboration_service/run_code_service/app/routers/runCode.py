from fastapi import APIRouter, Response, Request, status
from ..services.runCodeService import RunCodeService
from ..models.runCode import SetupRequest, CodeRequest

runCodeRouter = APIRouter(tags=["Questions"])

runCodeService = ""

@runCodeRouter.post("/setup")
def setup(question:SetupRequest):
    global runCodeService

    question_payload = {
        "run_code": question.run_code,
        "input": question.input,
        "expected_output": question.expected_output
    }
    runCodeService = RunCodeService(question_payload)

@runCodeRouter.post("/run")
async def runCode(userCode: CodeRequest, req: Request, res: Response):
    # print("Received question data:", userCode) #Log request
    try:
        result = await runCodeService.run(userCode.userCode)
        if result.get("error"):
            res.status_code = status.HTTP_400_BAD_REQUEST
            return {"message": result.get("error")}
        
        if runCodeService.check_output(result.get("stdout")):
            res.status_code = status.HTTP_200_OK
            return result
        res.status_code = status.HTTP_417_EXPECTATION_FAILED
        return result
    except Exception as e:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": str(e)}