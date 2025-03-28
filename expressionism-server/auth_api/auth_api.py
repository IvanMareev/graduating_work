from flask import Blueprint, jsonify, request  
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
import datetime
from models import User
from config import db

auth_api_blueprint = Blueprint("auth_api", __name__)

# Регистрация пользователя
@auth_api_blueprint.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'User already exists'}), 400

    new_user = User(username=data['username'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# Логин пользователя
@auth_api_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required'}), 400

    user = User.query.filter_by(username=data['username']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 200

@auth_api_blueprint.route('/me', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({
        'id': user.id,
        'username': user.username,
    })


@auth_api_blueprint.route("/token-info", methods=["GET"])
@jwt_required()
def token_info():
    # Получаем данные из токена
    jwt_payload = get_jwt()
    expiration_timestamp = jwt_payload["exp"]
    
    # Преобразуем время истечения в человекочитаемый формат
    expiration_datetime = datetime.datetime.utcfromtimestamp(expiration_timestamp)
    time_left = expiration_datetime - datetime.datetime.utcnow()
    is_valid = time_left.total_seconds() > 0

    return jsonify({
        "expires_at": expiration_datetime.isoformat(),
        "time_left_seconds": time_left.total_seconds(),
        "is_valid": is_valid
    })