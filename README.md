# Description
This is a simple todo list fullstack application built using Python with Flask and React. It features basic JWT authentication and has a simple Restful API to perform operations on tasks.

# Features
- Authentication using JWT tokens
- Add task
- Delete Task
- Edit Task status
- Get Tasks


# Prerequistes
Please ensure you have Python and NodeJS installed 

# Setup
Clone the github repository:
```
git clone https://github.com/AhmedSwisi/todo-list-task.git
cd todo-list-task
```

To run the project open a terminal in the backend directory:

```
cd backend
```
1. Create a Python Virtual Environment:
  ```
  python -m venv venv
  ```
2. Activate the Virtual Environemnt:
- On Windows
  ```
  .\venv\Scripts\activate
  ```
- On Mac or Linux
  ```
  source venv/bin/activate
  ```
3. Install the required Python packages:
```
pip install -r requirements.txt
```
4. Set up environment Variables: Create a .env file in the directory and configure the variables to your setup. The necessary variable keys can be found in /backend/app/config.py Example:
```
MY_DB_ENV='some_connection_string'
FLASK_APP=main.py
```
5. Run Database migrations:
```
flask db upgrade
```
6. Run Flask Server:
```
flask run
```

To setup the front end navigate to the frontend directory: 
```
cd frontend
```
1. Install required node_modules:
```
npm install
```
2. Run the Vite Server:
```
npm run dev
```

# Documentation
if you would prefer to test the endpoints using Postman, a collection is included in the root repo.

# References and Dependencies:
- Flask: https://flask.palletsprojects.com/en/3.0.x/
- Flask SQL alchemy: https://flask-sqlalchemy.palletsprojects.com/en/3.1.x/
- Flask Migrate: https://flask-migrate.readthedocs.io/en/latest/
- Flask PyJWT: https://flask-pyjwt.readthedocs.io/en/stable/
- React: https://react.dev/
- Python:https://docs.python.org/3/




