# app/routes.py
from flask import render_template, redirect, url_for, jsonify, request
from flask import current_app as app
from flask import Blueprint
from flasgger import swag_from
from .models import Task
from .extensions import db
from sqlalchemy.exc import SQLAlchemyError

tasks = Blueprint('hello', __name__)

@tasks.route("/tasks")
@swag_from({
    'responses': {
        200: {
            'description': 'returns all tasks',
            'examples': {
                'text/plain': 'Hello, From Flask Debug test resolve!'
            }
        }
    }
})
def read_all_tasks():
    tasks = Task.query.all()
    tasks_dict = [task.to_dict() for task in tasks]
    return jsonify(tasks_dict)

@tasks.route('/tasks',methods=['POST'])
@swag_from({
    'responses': {
        200: {
            'description': 'returns all tasks',
            'examples': {
                'text/plain': 'Hello, From Flask Debug test resolve!'
            }
        }
    }
})
def add_task():
    try:
        title = request.json['title']
        description = request.json['description']
        status = 'Pending'
        user_id=request.json['user_id']
        new_task = Task(title=title,description=description,status=status,user_id=user_id)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'message':'Added task successfully',
                        'title':title,
                        'description':description,
                        'status':status,
                        'user_id':user_id
                        }),201
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

@tasks.route('/tasks/<int:task_id>',methods=['PUT'])
# @swag_from({
#     'responses': {
#         200: {
#             'description': 'returns all tasks',
#             'examples': {
#                 'text/plain': 'Hello, From Flask Debug test resolve!'
#             }
#         }
#     }
# })
def update_task_status(task_id):
    try:
        task: Task = Task.query.get(task_id)
        status = request.json['status']
        task.status = status
        db.session.commit()
        return jsonify({'message':'Task updated successfully',
                        'title':task.title,
                        'description':task.description,
                        'status':task.status,
                        }),201
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
@tasks.route('/tasks/<int:task_id>',methods=['DELETE'])
# @swag_from({
#     'responses': {
#         200: {
#             'description': 'returns all tasks',
#             'examples': {
#                 'text/plain': 'Hello, From Flask Debug test resolve!'
#             }
#         }
#     }
# })
def delete_task(task_id):
    try:
        Task.query.filter_by(id = task_id).delete()
        db.session.commit()
        return jsonify({'message':'Task deleted successfully',
                        }),201
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
