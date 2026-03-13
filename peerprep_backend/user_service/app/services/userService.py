import uuid
from ..database.db import UserServiceDatabase
from ..services.auth import sha256_hash, hash_password

class UserService:
    def __init__(self):
        user_service_db = UserServiceDatabase()
        self.collection = user_service_db.get_collection("users")
        self.collection.create_index("user_id", unique=True)
        
    def create_user(self, email, password, username):
        user_id = str(uuid.uuid4())
        email_hash = sha256_hash(email)
        password_hash = hash_password(password)

        self.collection.insert_one({
            "user_id": user_id,
            "email_hash": email_hash,
            "password_hash": password_hash,
            "username": username,
            "role": "user"
        })

    def get_user_by_email(self, email):
        email_hash = sha256_hash(email)
        return self.collection.find_one({"email_hash": email_hash})

    def update_username(self, user_id, username):
        self.collection.update_one({"user_id": user_id}, {"$set": {"username": username}})