# app/__init__.py
from flask import Flask
from .config import Config
from .extensions import db, migrate
from flask_cors import CORS




def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    migrate.init_app(app, db)
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.config['CORS_HEADERS'] = 'Content-Type'

    with app.app_context():
        from . import routes, models
        # db.create_all()

    return app

