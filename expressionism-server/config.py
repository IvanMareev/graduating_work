from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

app = Flask(__name__)

# Настройки приложения
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DATABASE_URL"]
app.config['SECRET_KEY'] = 'your_secret_key'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 120
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = 86400

db = SQLAlchemy(app)
CORS(app)
jwt = JWTManager(app)

    



import main
