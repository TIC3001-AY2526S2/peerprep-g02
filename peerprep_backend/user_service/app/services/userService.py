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
        password_hash = hash_password(password)

        self.collection.insert_one({
            "user_id": user_id,
            "email": email,
            "password_hash": password_hash,
            "username": username,
            "role": "user"
        })

    def get_user_by_email(self, email):
        return self.collection.find_one({"email": email})

    def update_username(self, user_id, username):
        self.collection.update_one({"user_id": user_id}, {"$set": {"username": username}})

    def get_user_role(self, user_id: str) -> str:
        user = self.collection.find_one({"user_id": user_id})
        return user.get("role", "user") if user else "user"
    
    def get_user_by_user_id(self, user_id):
        user = self.collection.find_one({"user_id": user_id})
        return user

    def update_profile(self, user_id, username=None, email=None, password=None):
        update_fields = {}

        if username:
            update_fields["username"] = username

        if email:
            existing = self.collection.find_one({"email": email})
            if existing and existing["user_id"] != user_id:
                raise Exception("Email already in use")
            update_fields["email"] = email

        if password:
            update_fields["password_hash"] = hash_password(password)

        if update_fields:
            self.collection.update_one(
                {"user_id": user_id},
                {"$set": update_fields}
            )

    def update_username(self, user_id, username):
        self.update_profile(user_id, username=username)

    def get_user_role(self, user_id: str) -> str:
        user = self.collection.find_one({"user_id": user_id})
        return user.get("role", "user") if user else "user"
