MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "QuestionServiceDatabase"

from pymongo import MongoClient

class QuestionServiceDatabase:
    def __init__(self):
        try:
            self.client = MongoClient(MONGO_URI)
            self.db = self.client[DB_NAME]

            self.client.admin.command("ping") # connect to db

            print ("Connected to MongoDB successfully!")
        except Exception as e:
            print("Failed to connect to MongoDB:", e)

    def get_collection(self, name: str):
        return self.db[name]
