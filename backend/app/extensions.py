from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS,cross_origin
from flasgger import Swagger
from flask_pyjwt import AuthManager

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
swagger = Swagger()
auth_manager = AuthManager()