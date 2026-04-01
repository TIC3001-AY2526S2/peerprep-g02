# app/services/queueing_service.py
import json
import os
import aio_pika

class QueueingService:
    def __init__(self, host=None):
        self.host = os.environ.get("RABBITMQ_HOST", "localhost")
        self.connection = None
        self.channel = None

    async def connect(self):
        self.connection = await aio_pika.connect_robust(f"amqp://guest:guest@{self.host}")
        self.channel = await self.connection.channel()

    async def declare_queue(self, queue_name, durable=True):
        return await self.channel.declare_queue(queue_name, durable=durable)

    async def publish(self, queue_name, message):
        await self.channel.default_exchange.publish(
            aio_pika.Message(body=json.dumps(message).encode()),
            routing_key=queue_name
        )

    async def close(self):
        if self.connection:
            await self.connection.close()