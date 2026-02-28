from pymongo import MongoClient
import os

MONGO_URI = os.getenv("USER_DB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
DB_NAME = "UserServiceDatabase"

db = client["user_service_db"]
users_col = db["users"]

class UserServiceDatabase:
    def __init__(self, user_id, email_hash, password_hash, username, role):
        try:
            self.client = MongoClient(MONGO_URI)
            self.db = self.client[DB_NAME]

            self.user_id = user_id
            self.email_hash = email_hash
            self.password_hash = password_hash
            self.username = username
            self.role = role

            self.client.admin.command("ping")

            print ("User Service connected to MongoDB successfully!")
        except Exception as e:
            print("User Service failed to connect to MongoDB:", e)