from database.db import QuestionServiceDatabase
from services.topicService import TopicService


class QuestionService:
    def __init__(self):
        questionServiceDB = QuestionServiceDatabase()
        self.topicService = TopicService()
        self.collection = questionServiceDB.get_collection("questions")
        self.collection.create_index("id", unique=True)

    def insert_question(self, question_data):
        latest_id = self.collection.find_one(sort=[("id", -1)])
        if latest_id is None:  # no id, i.e. first entry
            latest_id = 0
        else:
            latest_id = latest_id["id"]

        question_data["id"] = latest_id + 1

        topics = self.topicService.available_topics()

        for cat in question_data["category"]:
            if cat not in topics:
                return {"insert": False, "error": "Category not available"}

        try:
            self.collection.insert_one(question_data)  # add into db
            question_data["_id"] = str(question_data["_id"])
            return {"insert": True, "question": question_data}
        except Exception as e:
            return {"insert": False, "error": str(e)}

    def fetch_all_questions(self):
        try:
            fetched_data = list(self.collection.find({}))
            for data in fetched_data:
                data["_id"] = str(data["_id"])
            return {"fetched": True, "questions": fetched_data}
        except Exception as e:
            return {"fetched": False, "error": str(e)}

    def fetch_question(self, questionID):
        try:
            if questionID is None:
                return {"fetched": False, "error": "Missing question ID"}

            fetched_data = self.collection.find_one({"id": questionID})

            fetched_data["_id"] = str(fetched_data["_id"])
            return {"fetched": True, "question": fetched_data}
        except Exception as e:
            print(str(e))
            return {"fetched": False, "error": str(e)}

    def update_question(self, question_data):
        try:
            questionID = question_data.get("id")

            if not questionID:
                return {"updated": False, "error": "Missing question ID"}

            update = self.collection.update_one({"id": questionID},
                                                {"$set": {
                                                    "title": question_data.get("title"),
                                                    "description": question_data.get("description"),
                                                    "category": question_data.get("category"),
                                                    "complexity": question_data.get("complexity")
                                                }})

            if update.matched_count == 0:
                return {"updated": False, "error": "No question found"}
            elif update.modified_count == 0:
                return {"updated": False, "error": "No changes updated"}
            return {"updated": True, "question": question_data}
        except Exception as e:
            print(str(e))
            return {"updated": False, "error": str(e)}

    def delete_question(self, questionID):
        try:
            if questionID is None:
                return {"deleted": False, "error": "Missing question ID"}

            question = self.collection.find_one({"id": questionID})
            if question is None:
                return {"deleted": False, "error": "Question not found"}
            deleted = self.collection.delete_one({"id": questionID})  # add into db
            if deleted.deleted_count == 1:
                return {"deleted": True}
            raise Exception
        except Exception as e:
            return {"deleted": False, "error": str(e)}