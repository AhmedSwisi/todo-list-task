# app/routes.py
from flask import render_template, redirect, url_for, jsonify
from flask import current_app as app
from flask import Blueprint
from flasgger import swag_from
from .models import Task

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
