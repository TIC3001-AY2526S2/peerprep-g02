from app.database.db import QuestionServiceDatabase
from app.services.topicService import TopicService

class QuestionService:
    def __init__(self):
        questionServiceDB = QuestionServiceDatabase()
        self.topicService = TopicService()
        self.collection = questionServiceDB.get_collection("questions")
        self.collection.create_index("id",unique=True)

    async def insert_question(self, question_data):
        latest_id = self.collection.find_one(sort=[("id", -1)])
        if latest_id is None: #no id, i.e. first entry
            latest_id = 0
        else:
            latest_id = latest_id["id"]

        question_data["id"] = latest_id + 1

        topics = self.topicService.available_topics()
        print(topics)

        for cat in question_data["category"]:
            if cat not in topics:
                return {"insert":False, "error": "Category not available"}
        
        try:
            self.collection.insert_one(question_data) # add into db
            question_data["_id"] = str(question_data["_id"])
            return {"insert":True, "question": question_data}
        except Exception as e:
            return {"insert":False, "error": str(e)}

    async def update_question(self, question_data):
        try:
            questionID = question_data.get("id")

            if not questionID:
                return {"updated":False, "error":"Missing question ID"}
            
            update = self.collection.update_one({"id":questionID},
                                                {"$set":{
                                                    "title": question_data.get("title"),
                                                    "description": question_data.get("description"),
                                                    "category": question_data.get("category"),
                                                    "complexity": question_data.get("complexity")
                                                }})
            
            if update.matched_count == 0:
                return {"updated":False, "error": "No question found"}
            elif update.modified_count == 0:
                return {"updated": False, "error": "No changes updated"}
            return {"updated": True, "question": question_data}
        except Exception as e:
            print(str(e))
            return {"updated": False, "error": str(e)}

