# app/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET = os.getenv('JWT_SECRET')
    JWT_AUTHTYPE = os.getenv('JWT_AUTHTYPE')
    JWT_ISSUER = os.getenv('Flash_PyJWT')
