from channels.generic.websocket import AsyncWebsocketConsumer
import json
# import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from jose import jwt
# from ..settings import SECRET_KEY
import os
from ..services.queueingService import QueueingService
SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_ME_TO_ENV_VAR")
ALGORITHM = "HS256"
class DebugConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("🔌 DEBUG: WebSocket connected")
        params = parse_qs(self.scope["query_string"].decode())
        token = params.get("token", [None])[0]
        print(token)
        # self.user_id = self.get_user_from_token(token)
        # print(self.user_id)
        # if not self.user_id:
        #     await self.close(code=401)
        #     return

        self.isWaiting = False
        self.timeout = 30

        # Initialize QueueingService
        # self.queue_service = QueueingService()
        # await self.queue_service.connect()

        # # Declare queues
        # self.match_queue = await self.queue_service.declare_queue(f"match_response_{self.user_id}")
        # self.request_queue = await self.queue_service.declare_queue("match_request")
        # self.timeout_queue = await self.queue_service.declare_queue("timeout_request")

        await self.accept()
    
    def get_user_from_token(self, token):
        try:
            print(SECRET_KEY)
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload.get("sub")
        except Exception:
            return None

    async def receive(self, text_data):
        print("📩 RECEIVED:", text_data)

        await self.send(text_data=json.dumps({
            "status": "Match Found (mock)",
            "match": {
                "roomId": "test-room",
                "users": ["self.user_id", "other-user"]
            }
        }))

    async def disconnect(self, close_code):
        print("❌ DEBUG disconnected:", close_code)