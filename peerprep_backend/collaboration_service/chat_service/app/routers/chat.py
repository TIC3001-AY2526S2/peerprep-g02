import socketio
from fastapi import FastAPI

sio = socketio.AsyncServer(
    cors_allowed_origins="*",
    async_mode="asgi"
)

@sio.event
async def connect(sid, environ):
    print("connected:", sid)

@sio.event
async def join_room(sid, data):
    print ("join data:", data)
    await sio.enter_room(sid, data["roomId"])
    print("join:", data)

@sio.event
async def send_message(sid, data):
    print(data)
    await sio.emit(
        "receive_message",
        data,
        room=data["roomId"]
    )
