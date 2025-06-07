from flask import Blueprint, jsonify, request, abort
from models import TemplateLvl1, TemplateModel, Lvl1  # Импорт моделей
from config import db  # Импортируем db для работы с базой данных

bp_template_lvl1 = Blueprint("template_lvl1", __name__)

# GET all template_lvl1 items
@bp_template_lvl1.route("/", methods=["GET"])
def get_all_template_lvl1():
    template_lvl1_items = TemplateLvl1.query.all()  # Получаем все записи из таблицы
    return jsonify([{
        "id": item.id,
        "template": item.template.name if item.template else None,
        "lvl1": item.lvl1.name if item.lvl1 else None,
        "always_eat": item.always_eat
    } for item in template_lvl1_items])

# GET one template_lvl1 item by ID
@bp_template_lvl1.route("/<int:template_lvl1_id>", methods=["GET"])
def get_template_lvl1(template_lvl1_id):
    template_lvl1_item = TemplateLvl1.query.get(template_lvl1_id)  # Получаем запись по ID
    if not template_lvl1_item:
        abort(404, description="TemplateLvl1 item not found")  # Если нет записи, возвращаем 404
    return jsonify({
        "id": template_lvl1_item.id,
        "template": template_lvl1_item.template.name if template_lvl1_item.template else None,
        "lvl1": template_lvl1_item.lvl1.name if template_lvl1_item.lvl1 else None,
        "always_eat": template_lvl1_item.always_eat
    })

# POST create new template_lvl1 item
@bp_template_lvl1.route("/", methods=["POST"])
def create_template_lvl1():
    data = request.get_json()  # Получаем данные из запроса
    template_id = data.get("template_id")
    lvl1_id = data.get("lvl_id")
    always_eat = data.get("always_eat")

    # Получаем связанные объекты
    template = TemplateModel.query.get(template_id)
    lvl1 = Lvl1.query.get(lvl1_id)

    if not template or not lvl1:
        abort(400, description="Invalid template_id or lvl1_id")  # Проверяем, что объекты существуют

    # Проверяем, существует ли уже объект с таким template_id и lvl1_id
    existing_template_lvl1 = TemplateLvl1.query.filter_by(template_id=template_id, lvl1_id=lvl1_id).first()

    if existing_template_lvl1:
        # Если объект существует, возвращаем его данные
        return jsonify({
            "id": existing_template_lvl1.id,
            "template": existing_template_lvl1.template.name,
            "lvl1": existing_template_lvl1.lvl1.name,
            "always_eat": existing_template_lvl1.always_eat
        }), 200  # Возвращаем данные существующего объекта с кодом 200 (OK)

    # Создаем новый объект TemplateLvl1, если такого еще нет
    new_template_lvl1 = TemplateLvl1(template_id=template_id, lvl1_id=lvl1_id, always_eat=always_eat)
    db.session.add(new_template_lvl1)  # Добавляем в сессию
    db.session.commit()  # Сохраняем изменения в базе данных

    return jsonify({
        "id": new_template_lvl1.id,
        "template": new_template_lvl1.template.name,
        "lvl1": new_template_lvl1.lvl1.name,
        "always_eat": new_template_lvl1.always_eat
    }), 201  # Возвращаем ответ с данными нового объекта

# PUT update an existing template_lvl1 item
@bp_template_lvl1.route("/<int:template_lvl1_id>", methods=["PUT"])
def update_template_lvl1(template_lvl1_id):
    template_lvl1_item = TemplateLvl1.query.get(template_lvl1_id)  # Получаем запись по ID
    if not template_lvl1_item:
        abort(404, description="TemplateLvl1 item not found")  # Если запись не найдена, возвращаем 404

    data = request.get_json()  # Получаем новые данные
    template_id = data.get("template_id", template_lvl1_item.template_id)
    lvl1_id = data.get("lvl1_id", template_lvl1_item.lvl1_id)
    always_eat = data.get("always_eat", template_lvl1_item.always_eat)

    # Получаем связанные объекты
    template = TemplateModel.query.get(template_id)
    lvl1 = Lvl1.query.get(lvl1_id)

    if not template or not lvl1:
        abort(400, description="Invalid template_id or lvl1_id")  # Проверяем, что объекты существуют

    # Обновляем объект
    template_lvl1_item.template_id = template_id
    template_lvl1_item.lvl1_id = lvl1_id
    template_lvl1_item.always_eat = always_eat
    db.session.commit()  # Сохраняем изменения в базе данных

    return jsonify({
        "id": template_lvl1_item.id,
        "template": template_lvl1_item.template.name,
        "lvl1": template_lvl1_item.lvl1.name,
        "always_eat": template_lvl1_item.always_eat
    })

# DELETE template_lvl1 item by ID
@bp_template_lvl1.route("/<int:template_lvl1_id>", methods=["DELETE"])
def delete_template_lvl1(template_lvl1_id):
    template_lvl1_item = TemplateLvl1.query.get(template_lvl1_id)  # Получаем запись по ID
    if not template_lvl1_item:
        abort(404, description="TemplateLvl1 item not found")  # Если запись не найдена, возвращаем 404

    db.session.delete(template_lvl1_item)  # Удаляем запись
    db.session.commit()  # Сохраняем изменения в базе данных

    return jsonify({"message": f"TemplateLvl1 item {template_lvl1_id} deleted"})  # Возвращаем сообщение о удалении
