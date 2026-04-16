import pika 
import json 
import uuid 
import os
import time

class MatchingService: 
    def __init__(self): 
        self.waiting_users = [] 
        self.host = os.environ.get('RABBITMQ_HOST', 'localhost') 
        self.port = 5672 
        self.start() 
    
    def start(self):
        while True:
            try:
                connection = pika.BlockingConnection(
                    pika.ConnectionParameters(self.host, self.port)
                )
                channel = connection.channel()

                channel.queue_declare(queue="match_request", durable=True)
                channel.queue_declare(queue="timeout_request", durable=True)

                channel.basic_consume(
                    queue="match_request",
                    on_message_callback=self.callback,
                    auto_ack=True,
                )

                channel.basic_consume(
                    queue="timeout_request",
                    on_message_callback=self.timeout_callback,
                    auto_ack=True,
                )

                print("Matching worker started")
                channel.start_consuming()

            except Exception as e:
                print("Retrying RabbitMQ...", e)
                time.sleep(5)
    
    def callback(self, ch, method, properties, body): 
        user = json.loads(body) 
        self.find_match(user) 
    
    def timeout_callback(self, ch, method, properties, body): 
        user = json.loads(body) 
        self.remove_user(user) 
        
    def find_match(self, user): 
        for i, other in enumerate(self.waiting_users): 
            if ( other["topic"] == user["topic"] and 
                other["complexity"] == user["complexity"] and 
                other["user_id"] != user["user_id"] ): 
                    room_id = str(uuid.uuid4()) 
                    match_result = { "roomId": room_id, "users": [user["user_id"], other["user_id"]], } 
                    self.publish(f"match_response_{user['user_id']}", match_result) 
                    self.publish(f"match_response_{other['user_id']}", match_result) 
                    self.waiting_users.pop(i) 
                    return 
            
        if user not in self.waiting_users: 
            self.waiting_users.append(user) 
    
    def remove_user(self, user): 
        for i, waiting_user in enumerate(self.waiting_users): 
            if user["user_id"] == waiting_user["user_id"]: 
                self.waiting_users.pop(i) 
                
    def publish(self, queue, message): 
        connection = pika.BlockingConnection(pika.ConnectionParameters(self.host)) 
        channel = connection.channel() 
        channel.queue_declare(queue=queue, durable=True) 
        channel.basic_publish( exchange="", routing_key=queue, body=json.dumps(message), properties=pika.BasicProperties(delivery_mode=2), ) 
        connection.close()