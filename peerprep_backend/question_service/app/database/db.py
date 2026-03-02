from pymongo import MongoClient
import os
import json

MONGO_URI = os.getenv("QUESTION_DB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)

DB_NAME = "question_service_db"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTION_SEED_FILE = os.path.join(BASE_DIR, "../data/defaultQuestions.json")
TOPIC_SEED_FILE = os.path.join(BASE_DIR, "../data/defaultTopics.json")

class QuestionServiceDatabase:
    def __init__(self):
        try:
            self.client = MongoClient(MONGO_URI)
            self.db = self.client[DB_NAME]

            self.client.admin.command("ping")

            print ("Question Service connected to MongoDB successfully!")

            self.seed_at_startup()
        except Exception as e:
            print("Question Service failed to connect to MongoDB:", e)

    def get_collection(self, name: str):
        return self.db[name]
    
    def seed_collection(self, collection_name: str, json_file_path: str, overwrite: bool = False):
        """
        Seeds a MongoDB collection from a JSON file.
        """
        try:
            collection = self.get_collection(collection_name)

            with open(json_file_path, "r", encoding="utf-8") as file:
                data = json.load(file)

            if not isinstance(data, list):
                raise ValueError("JSON file must contain a list of documents.")

            if overwrite:
                collection.delete_many({})
                print(f"Existing documents in '{collection_name}' deleted.")

            if data:
                collection.insert_many(data)
                print(f"Inserted {len(data)} documents into '{collection_name}' successfully!")
            else:
                print("No data found in JSON file to insert.")

        except Exception as e:
            print(f"Failed to seed collection '{collection_name}':", e)

    def seed_at_startup(self):
        questions_collection = self.get_collection("questions")
        topics_collection = self.get_collection("topics")
        if questions_collection.count_documents({}) == 0:
            print("Seeding questions collection at startup...")
            self.seed_collection("questions",QUESTION_SEED_FILE)
        if topics_collection.count_documents({}) == 0:
            print("Seeding topics collection at start up...")
            self.seed_collection("topics", TOPIC_SEED_FILE)
