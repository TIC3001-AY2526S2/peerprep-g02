import uuid
from ..database.db import users_col
from ..services.auth import sha256_hash, hash_password

class UserService:
    def create_user(email, password, username):
        user_id = str(uuid.uuid4())
        email_hash = sha256_hash(email)
        password_hash = hash_password(password)

        users_col.insert_one({
            "user_id": user_id,
            "email_hash": email_hash,
            "password_hash": password_hash,
            "username": username,
            "role": "user"
        })

    def get_user_by_email(email):
        email_hash = sha256_hash(email)
        return users_col.find_one({"email_hash": email_hash})

    def update_username(user_id, username):
        users_col.update_one({"user_id": user_id}, {"$set": {"username": username}})