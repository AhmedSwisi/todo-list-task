# app/routes.py
from flask import jsonify, request, g
from flask import current_app as app
from flask import Blueprint
from flasgger import swag_from
from .models import Task, User
from .extensions import db, auth_manager
from sqlalchemy.exc import SQLAlchemyError
from flask_pyjwt import jwt, require_token
from datetime import datetime, timedelta
from .utils import decode_jwt
from functools import wraps

tasks = Blueprint('tasks', __name__)
auth = Blueprint('auth', __name__, url_prefix='/auth')

# In-memory token blacklist
blacklist = set()

def require_token():
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                if token in blacklist:
                    return jsonify({'message': 'auth token is not valid'}), 401
                try:
                    payload = decode_jwt(token)
                    g.identity = payload['sub']
                except Exception as e:
                    return jsonify({'message': 'auth token is not valid'}), 401
            else:
                return jsonify({'message': 'auth token is missing'}), 401
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@tasks.route("/tasks")
@require_token()
def read_all_tasks():
    user_id = g.identity
    tasks = Task.query.filter_by(user_id=user_id).all()
    tasks_dict = [task.to_dict() for task in tasks]
    return jsonify(tasks_dict)

@tasks.route('/tasks', methods=['POST'])
@require_token()
def add_task():
    try:
        title = request.json['title']
        description = request.json['description']
        status = 'Pending'
        user_id = request.json['user_id']
        new_task = Task(title=title, description=description, status=status, user_id=user_id)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'message': 'Added task successfully',
                        'title': title,
                        'description': description,
                        'status': status,
                        'user_id': user_id
                        }), 201
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

@tasks.route('/tasks/<int:task_id>', methods=['PUT'])
@require_token()
def update_task_status(task_id):
    try:
        task: Task = Task.query.get(task_id)
        status = request.json['status']
        task.status = status
        db.session.commit()
        return jsonify({'message': 'Task updated successfully',
                        'title': task.title,
                        'description': task.description,
                        'status': task.status,
                        }), 201
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
@tasks.route('/tasks/<int:task_id>', methods=['DELETE'])
@require_token()
def delete_task(task_id):
    try:
        Task.query.filter_by(id=task_id).delete()
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully',
                        }), 201
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

@auth.route("/login", methods=['POST'])
def post_token():
    email = request.json['email']
    password = request.json['password']
    user: User = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        token = auth_manager.auth_token(subject=user.id, identity=email)
        refresh_token = auth_manager.refresh_token(user.id)
        
        return jsonify(
            {
                'access_token': token.signed,
                'refresh_token': refresh_token.signed
            }
        ), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@auth.route("/user", methods=['GET'])
@require_token()
def get_auth_user():
    user_id = g.identity
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({'message': 'User not found'}), 404

@auth.route("/register", methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']
    username = request.json['username']
    
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 409
    
    new_user = User(email=email, username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@auth.route("/refresh", methods=['POST'])
def refresh_token():
    refresh_token = request.json['refresh_token']
    if not refresh_token:
        return jsonify({'message': 'Refresh token is missing'}), 400

    try:
        payload = decode_jwt(refresh_token)
        user_id = payload['sub']
        user = User.query.get(user_id)
        
        if user:
            access_token = auth_manager.auth_token(subject=user.id, identity=user.email)
            return jsonify({'access_token': access_token.signed}), 200
        else:
            return jsonify({'message': 'Invalid refresh token'}), 401

    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid refresh token'}), 401

@auth.route("/logout", methods=['POST'])
@require_token()
def logout():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        try:
            blacklist.add(token)
            return jsonify({'message': 'Logged out successfully'}), 200
        except Exception as e:
            return jsonify({'message': 'Failed to logout'}), 500
    return jsonify({'message': 'Authorization token missing or invalid'}), 401
