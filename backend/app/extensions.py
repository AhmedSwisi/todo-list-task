from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS,cross_origin
from flasgger import Swagger

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
swagger = Swagger()