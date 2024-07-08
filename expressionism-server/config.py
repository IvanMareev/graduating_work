from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{app.root_path}/expressionism.sqlite"
app.json.sort_keys = False
app.debug = True

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(app, model_class=Base)
