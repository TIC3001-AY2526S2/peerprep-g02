from fastapi import FastAPI, Request, Response, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

import httpx
import websockets
import asyncio
import os

app = FastAPI()

USER_SERVICE = "http://user-service:8000"
QUESTION_SERVICE = "http://question-service:8000"
QUEUEING_SERVICE = os.getenv("QUEUEING_SERVICE_URL", "ws://queueing-service:8000")
CHAT_SERVICE = os.getenv("CHAT_SERVICE_URL", "ws://chat-service:8000")
RUN_CODE_SERVICE = os.getenv("RUN_CODE_SERVICE_URL", "http://run-code-service:8000")
SUBMIT_SERVICE = os.getenv("SUBMIT_SERVICE_URL", "ws://submit-service:8000")

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set in environment variables")
print("SECRET KEY:", SECRET_KEY)

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
    try:
        # merged filtered headers and extra_headers
        merged_headers = {
            k: v for k, v in request.headers.items()
            if k.lower() not in ("host", "content-length")
        }
        merged_headers.update(extra_headers)

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=merged_headers,
                content=await request.body(),
                params=request.query_params,
            )
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers)
        )
    except httpx.ConnectError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Downstream service unreachable at {target_url}. "
                   f"Check that the service is running and on the same Docker network. Error: {str(e)}"
        )
    except httpx.TimeoutException as e:
        raise HTTPException(
            status_code=504,
            detail=f"Downstream service timed out at {target_url}: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gateway error when forwarding to {target_url}: {str(e)}"
        )

# stripped prefix for downstream services
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

    user_id = websocket.query_params.get("user_id")
    if not user_id:
        await websocket.close(code=4001)
        return

    try:
        async with websockets.connect(
                f"{QUEUEING_SERVICE}/ws/matching/?user_id={user_id}"
        ) as matching_ws:
            

            async def client_to_service():
                try:
                    while True:
                        data = await websocket.receive_text()
                        await matching_ws.send(data)
                except (WebSocketDisconnect, Exception):
                    await matching_ws.close()

            async def service_to_client():
                try:
                    while True:
                        data = await matching_ws.recv()
                        await websocket.send_text(data)
                except Exception:
                    pass  # don't close

            await asyncio.gather(client_to_service(), service_to_client())

    except Exception as e:
        print("WebSocket connection failed:", e)

    finally:
        try:
            await websocket.close()  # close once
        except Exception:
            pass  # closed, ignore

@app.websocket("/chat/{path:path}")
async def chat_proxy(path: str, websocket: WebSocket):
    await websocket.accept()
    target = f"{CHAT_SERVICE}/{path}"
    try:
        async with websockets.connect(target) as chat_ws:
            async def c2s():
                try:
                    while True:
                        data = await websocket.receive_text()
                        await chat_ws.send(data)
                except (WebSocketDisconnect, Exception):
                    await chat_ws.close()

            async def s2c():
                try:
                    while True:
                        data = await chat_ws.recv()
                        await websocket.send_text(data)
                except Exception:
                    pass

            await asyncio.gather(c2s(), s2c())
    except Exception as e:
        print("Chat WS proxy failed:", e)
    finally:
        try:
            await websocket.close()
        except Exception:
            pass

@app.api_route("/run-code/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def run_code_proxy(path: str, request: Request, user: dict = Depends(verify_token)):
    target_url = f"{RUN_CODE_SERVICE}/{path}"
    return await forward_request(request, target_url)

@app.websocket("/ws/submit/{room_id}/{user_id}/")
async def submit_proxy(room_id: str, user_id: str, websocket: WebSocket):
    await websocket.accept()
    target = f"{SUBMIT_SERVICE}/ws/submit/{room_id}/{user_id}/"
    try:
        async with websockets.connect(target) as submit_ws:
            async def c2s():
                try:
                    while True:
                        data = await websocket.receive_text()
                        await submit_ws.send(data)
                except (WebSocketDisconnect, Exception):
                    await submit_ws.close()

            async def s2c():
                try:
                    while True:
                        data = await submit_ws.recv()
                        await websocket.send_text(data)
                except Exception:
                    pass

            await asyncio.gather(c2s(), s2c())
    except Exception as e:
        print("Submit WS proxy failed:", e)
    finally:
        try:
            await websocket.close()
        except Exception:
            pass