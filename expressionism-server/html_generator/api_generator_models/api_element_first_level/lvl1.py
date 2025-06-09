from flask import Blueprint, jsonify, request, abort
from models import Lvl1  # Импорт модели
from config import db  # Импортируем db для работы с базой данных

# Создаем Blueprint для уровня 1
bp_lvl1 = Blueprint("lvl1", __name__)

# GET all lvl1 items
@bp_lvl1.route("", methods=["GET"])
def get_all_lvl1():
    lvl1_items = Lvl1.query.all()  # Получаем все записи из таблицы
    return jsonify([{"id": item.id, "name": item.name, "level": item.level} for item in lvl1_items])

# GET one lvl1 item by ID
@bp_lvl1.route("/<int:lvl1_id>", methods=["GET"])
def get_lvl1(lvl1_id):
    lvl1_item = Lvl1.query.get(lvl1_id)  # Получаем запись по ID
    if not lvl1_item:
        abort(404, description="Lvl1 item not found")  # Если нет записи, возвращаем 404
    return jsonify({"id": lvl1_item.id, "name": lvl1_item.name, "level": lvl1_item.level})

# POST create new lvl1 item
@bp_lvl1.route("", methods=["POST"])
def create_lvl1():
    data = request.get_json()  # Получаем данные из запроса
    name = data.get("name")
    level = data.get("level", 1)  # Если level не передан, по умолчанию 1

    new_lvl1 = Lvl1(name=name, level=level)  # Создаем новый объект Lvl1
    db.session.add(new_lvl1)  # Добавляем в сессию
    db.session.commit()  # Сохраняем изменения в базе данных

    return jsonify({"id": new_lvl1.id, "name": new_lvl1.name, "level": new_lvl1.level}), 201  # Возвращаем ответ с данными нового объекта

# PUT update an existing lvl1 item
@bp_lvl1.route("/<int:lvl1_id>", methods=["PUT"])
def update_lvl1(lvl1_id):
    lvl1_item = Lvl1.query.get(lvl1_id)  # Получаем запись по ID
    if not lvl1_item:
        abort(404, description="Lvl1 item not found")  # Если запись не найдена, возвращаем 404

    data = request.get_json()  # Получаем новые данные
    lvl1_item.name = data.get("name", lvl1_item.name)  # Обновляем поле name
    lvl1_item.level = data.get("level", lvl1_item.level)  # Обновляем поле level
    db.session.commit()  # Сохраняем изменения в базе данных

    return jsonify({"id": lvl1_item.id, "name": lvl1_item.name, "level": lvl1_item.level})

# DELETE lvl1 item by ID
@bp_lvl1.route("/<int:lvl1_id>", methods=["DELETE"])
def delete_lvl1(lvl1_id):
    lvl1_item = Lvl1.query.get(lvl1_id)  # Получаем запись по ID
    if not lvl1_item:
        abort(404, description="Lvl1 item not found")  # Если запись не найдена, возвращаем 404

    db.session.delete(lvl1_item)  # Удаляем запись
    db.session.commit()  # Сохраняем изменения в базе данных

    return jsonify({"message": f"Lvl1 item {lvl1_id} deleted"})  # Возвращаем сообщение о удалении
