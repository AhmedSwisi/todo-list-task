from sqlalchemy import Integer, String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import db
from typing import List
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password:Mapped[str]
    tasks:Mapped[List["Task"]] = relationship("Task",back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<User {self.username}>'
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
        }
    
class Task(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title:Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    description:Mapped[str] = mapped_column(String(256), nullable=False)
    status:Mapped[str] = mapped_column(String(80), nullable=False)
    user_id:Mapped[int] = mapped_column(ForeignKey("user.id"))
    user:Mapped["User"] = relationship("User", back_populates="tasks")

    def __init__(self, **kwargs):
        super(Task, self).__init__(**kwargs)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'user_id': self.user_id
        }
