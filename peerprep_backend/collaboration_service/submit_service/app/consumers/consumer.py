import json
from channels.generic.websocket import AsyncWebsocketConsumer

rooms = {}


class SubmitConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]

        if not room or not room["connections"]:
            room = {
                "users": set(),
                "submitted": set(),
                "connections": {}
            }
            rooms[self.room_id] = room

        room["users"].add(self.user_id)
        room["connections"][self.user_id] = self

        await self.accept()

        await self.send(text_data=json.dumps({
            "status": "connected",
            "submitted": list(room["submitted"]),
            "users": list(room["users"])
        }))

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data.get("action") == "submit":
            await self.handle_submit()

    async def handle_submit(self):
        room = rooms.get(self.room_id)
        if not room:
            return

        room["submitted"].add(self.user_id)

        is_done = room["submitted"] == room["users"]

        payload = {
            "status": "both_submitted" if is_done else "waiting",
            "submitted": list(room["submitted"]),
            "users": list(room["users"]),
        }

        # broadcast to ALL users (not per-user logic)
        for conn in list(room["connections"].values()):
            await conn.send(text_data=json.dumps(payload))

    async def disconnect(self, close_code):
        room = rooms.get(self.room_id)
        if not room:
            return

        room["users"].discard(self.user_id)
        room["submitted"].discard(self.user_id)
        room["connections"].pop(self.user_id, None)

        for conn in list(room["connections"].values()):
            await conn.send(text_data=json.dumps({"status": "peer_disconnected"}))

        if not room["connections"]:
            rooms.pop(self.room_id, None)

    async def send_message(self, event):
        await self.send(text_data=json.dumps(event["payload"]))
