from pymongo import MongoClient
import os

MONGO_URI = os.getenv("QUESTION_DB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
DB_NAME = "QuestionServiceDatabase"

class QuestionServiceDatabase:
    def __init__(self):
        try:
            self.client = MongoClient(MONGO_URI)
            self.db = self.client[DB_NAME]

            self.client.admin.command("ping")

            print ("Question Service connected to MongoDB successfully!")
        except Exception as e:
            print("Question Service failed to connect to MongoDB:", e)

    def get_collection(self, name: str):
        return self.db[name]