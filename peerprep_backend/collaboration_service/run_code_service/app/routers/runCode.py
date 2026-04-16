from fastapi import APIRouter, Response, Request, status
from ..services.runCodeService import RunCodeService
from ..models.runCode import SetupRequest, CodeRequest

runCodeRouter = APIRouter(tags=["Questions"])

runCodeService = ""


@runCodeRouter.post("/setup")
def setup(question: SetupRequest):
    global runCodeService

    question_payload = {
        "run_code": question.run_code
    }
    runCodeService = RunCodeService(question_payload)


@runCodeRouter.post("/run")
async def runCode(userCode: CodeRequest, req: Request, res: Response):
    # print("Received question data:", userCode) # diagnostic request
    try:
        result = await runCodeService.run(userCode.userCode, userCode.input)
        print(result)
        if result.get("stderr") or result.get("compile_output"):
            res.status_code = status.HTTP_400_BAD_REQUEST
            return {"resultPassed": False, "message": result.get("stderr")}

        if runCodeService.check_output(result.get("stdout"), userCode.expected_output):
            res.status_code = status.HTTP_200_OK
            return {"resultPassed": True}
        return {"resultPassed": False}
    except Exception as e:
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": str(e)}
