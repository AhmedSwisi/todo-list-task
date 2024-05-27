# app/routes.py
from flask import render_template, redirect, url_for
from flask import current_app as app


@app.route("/")
def hello_world():
    return "Hello, From Flask Debug test resolve!"
