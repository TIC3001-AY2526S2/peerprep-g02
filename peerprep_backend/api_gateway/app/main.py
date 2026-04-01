from fastapi import FastAPI, Request, Response, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx
import websockets
import asyncio

app = FastAPI()

USER_SERVICE = "http://user-service:8000"
QUESTION_SERVICE = "http://question-service:8000"
QUEUEING_SERVICE = "ws://queueing-service:8000"

SECRET_KEY = "CHANGE_ME_TO_ENV_VAR"
ALGORITHM = "HS256"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("Decoded token payload:", payload)
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def admin_required(user: dict = Depends(verify_token)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

async def forward_request(request: Request, target_url: str, extra_headers: dict = {}):
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=target_url,
            headers={**dict(request.headers), **extra_headers},
            content=await request.body(),
            params=request.query_params,
        )

    return Response(
        content=response.content,
        status_code=response.status_code,
        headers=dict(response.headers)
    )

@app.api_route("/questions/{path:path}", methods=["GET"])
async def question_read_proxy(path: str, request: Request):
    target_url = f"{QUESTION_SERVICE}/{path}"
    return await forward_request(request, target_url)

@app.api_route("/questions/{path:path}", methods=["POST", "PUT", "DELETE"])
async def question_write_proxy(path: str, request: Request, user: dict = Depends(admin_required)):
    extra_headers = {"X-User-Role": user.get("role"), "X-Username": user.get("sub")}
    target_url = f"{QUESTION_SERVICE}/{path}"
    print("target_url: ", target_url)
    return await forward_request(request, target_url, extra_headers)

@app.api_route("/users/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def user_proxy(path: str, request: Request):
    target_url = f"{USER_SERVICE}/{path}"
    return await forward_request(request, target_url)

@app.websocket("/matching/")
async def websocket_proxy(websocket: WebSocket):
    await websocket.accept()

    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4001)
        return

    try:
        async with websockets.connect(
            f"{QUEUEING_SERVICE}/ws/matching/?token={token}"
        ) as matching_ws:

            async def client_to_service():
                try:
                    while True:
                        data = await websocket.receive_text()
                        await matching_ws.send(data)
                except WebSocketDisconnect:
                    await matching_ws.close()
                except Exception:
                    await matching_ws.close()

            async def service_to_client():
                try:
                    while True:
                        data = await matching_ws.recv()
                        await websocket.send_text(data)
                except Exception:
                    await websocket.close()

            await asyncio.gather(client_to_service(), service_to_client())

    except Exception as e:
        print("WebSocket connection failed:", e)
        await websocket.close()