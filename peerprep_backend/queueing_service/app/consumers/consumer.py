# consumers.py
import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from jose import jwt
from ..settings import SECRET_KEY
from ..services.queueingService import QueueingService

class MatchingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        params = parse_qs(self.scope["query_string"].decode())
        token = params.get("token", [None])[0]
        self.user_id = self.get_user_from_token(token)
        if not self.user_id:
            await self.close(code=401)
            return

        self.isWaiting = False
        self.timeout = 30

        # Initialize QueueingService
        self.queue_service = QueueingService()
        await self.queue_service.connect()

        # Declare queues
        self.match_queue = await self.queue_service.declare_queue(f"match_response_{self.user_id}")
        self.request_queue = await self.queue_service.declare_queue("match_request")
        self.timeout_queue = await self.queue_service.declare_queue("timeout_request")

        await self.accept()

    def get_user_from_token(self, token):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return payload.get("sub")
        except Exception:
            return None

    async def receive(self, text_data):
        data = json.loads(text_data)

        if self.isWaiting:
            return
        match_data = {
            "user_id": self.user_id,
            "topic": data["topic"],
            "complexity": data["complexity"],
        }

        # Publish match request
        await self.queue_service.publish("match_request", match_data)

        await self.send(json.dumps({"status": "Waiting"}))
        self.isWaiting = True

        self.listen_task = asyncio.create_task(self.listen_for_matches())

    async def listen_for_matches(self):
        async with self.match_queue.iterator() as queue_iter:
            try:
                async with asyncio.timeout(self.timeout):
                    async for message in queue_iter:
                        async with message.process():
                            match = json.loads(message.body)
                            if self.user_id in match["users"]:
                                await self.send(json.dumps({"status": "Match Found", "match": match}))
                                await self.close()
                                return
            except asyncio.TimeoutError:
                self.isWaiting = False
                await self.queue_service.publish("timeout_request", {"user_id": self.user_id})
                await self.send(json.dumps({"status": "timeout", "message": "No match found within time limit"}))
                await self.close()