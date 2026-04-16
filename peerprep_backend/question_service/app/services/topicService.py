import sys
import os

app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(app_path)

from ..database.db import QuestionServiceDatabase

class TopicService:
    def __init__(self):
        questionServiceDB = QuestionServiceDatabase()
        self.collection = questionServiceDB.get_collection("topics")
        self.collection.create_index("topic", unique=True)

    def create_topic(self, topic):
        try:
            self.collection.insert_one({"topic": topic})
            topic["_id"] = str(topic["_id"])
            return {"insert": True, "topic": topic}
        except Exception as e:
            return {"insert": False, "error": str(e)}

    def available_topics(self):
        topics = []
        topics_db = self.collection.find({})
        for topic in topics_db:
            topics.append(topic["topic"])
        return topics