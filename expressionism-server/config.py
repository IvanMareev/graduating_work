from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate



app = Flask(__name__)

# Настройки приложения
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{app.root_path}/expressionism.sqlite"
app.config['JWT_SECRET_KEY'] = 'b65d1f49e7a4f79d6f4f758d75d06445'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 120  # 1 час



# TODO вввести в эксплуатацию рефреш токен 
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = 86400  # 1 день
app.json.sort_keys = False
app.debug = True



# CORS и JWT
CORS(app)
jwt = JWTManager(app)

# База данных
class Base(DeclarativeBase):
    pass

db = SQLAlchemy(app, model_class=Base)


if __name__ == "__main__":
    app.run(debug=True)

