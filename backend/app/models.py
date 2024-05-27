from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from . import db

class User(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password:Mapped[str]

    def __repr__(self):
        return f'<User {self.username}>'
