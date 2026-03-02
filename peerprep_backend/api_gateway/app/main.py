from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

USER_SERVICE = "http://localhost:5001"
QUESTION_SERVICE = "http://localhost:5002"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def forward_request(request: Request, target_url: str):
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=target_url,
            headers=dict(request.headers),
            content=await request.body(),
            params=request.query_params,
        )

    return Response(
        content=response.content,
        status_code=response.status_code,
        headers=dict(response.headers)
    )


@app.api_route("/questions/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def question_proxy(path: str, request: Request):
    target_url = f"{QUESTION_SERVICE}/{path}"
    print("target_url: ", target_url)
    return await forward_request(request, target_url)


@app.api_route("/users/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def user_proxy(path: str, request: Request):
    target_url = f"{USER_SERVICE}/{path}"
    return await forward_request(request, target_url)