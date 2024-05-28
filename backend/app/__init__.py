# app/__init__.py
from flask import Flask
from .config import Config
from .extensions import db, migrate, swagger,cors, auth_manager
from flask_cors import CORS
from .routes import tasks,auth




def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.register_blueprint(tasks)
    app.register_blueprint(auth)
    auth_manager.init_app(app)
    migrate.init_app(app, db)
    db.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    app.config['CORS_HEADERS'] = 'Content-Type'
    swagger.__init__(app)

    with app.app_context():
        from . import routes, models
        # db.create_all()
    


    return app

