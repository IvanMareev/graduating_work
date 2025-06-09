from flask import Blueprint, jsonify, request, abort
from models import LayoutVariant1, TemplateLvl1  # Импортируем модели
from config import db  # Импортируем db для работы с базой данных

bp_layout_variant_1 = Blueprint("layout_variant_1", __name__)

# GET all layout_variant_1 items
@bp_layout_variant_1.route("", methods=["GET"])
def get_all_layout_variant1():
    layout_variant1_items = LayoutVariant1.query.all()  # Получаем все записи из таблицы
    return jsonify([{
        "id": item.id,
        "template_lvl1": item.template_lvl1.id if item.template_lvl1 else None,
        "is_active": item.is_active,
        "css_style": item.css_style,
        "html": item.html
    } for item in layout_variant1_items])

# GET one layout_variant_1 item by ID
@bp_layout_variant_1.route("/<int:layout_variant1_id>", methods=["GET"])
def get_layout_variant1(layout_variant1_id):
    layout_variant1_item = LayoutVariant1.query.get(layout_variant1_id)  # Получаем запись по ID
    if not layout_variant1_item:
        abort(404, description="LayoutVariant1 item not found")  # Если нет записи, возвращаем 404
    return jsonify({
        "id": layout_variant1_item.id,
        "template_lvl1": layout_variant1_item.template_lvl1.id if layout_variant1_item.template_lvl1 else None,
        "is_active": layout_variant1_item.is_active,
        "css_style": layout_variant1_item.css_style,
        "html": layout_variant1_item.html
    })

# POST create new layout_variant_1 item
@bp_layout_variant_1.route("", methods=["POST"])
def create_layout_variant1():
    
    data = request.get_json()  # Получаем данные из запроса
    print('data', data)
    template_lvl1_id = data.get("template_lvl_id")
    is_active = data.get("is_active")
    css_style = data.get("css_style")
    html = data.get("html")

    # Получаем связанный объект TemplateLvl1
    template_lvl1 = TemplateLvl1.query.get(template_lvl1_id)
    if not template_lvl1:
        abort(400, description="Invalid template_lvl1_id")  # Проверяем, что объект существует

    # Создаем новый объект LayoutVariant1
    new_layout_variant1 = LayoutVariant1(
        template_lvl1_id=template_lvl1_id, 
        is_active=is_active,
        css_style=css_style, 
        html=html
    )
    db.session.add(new_layout_variant1)  # Добавляем в сессию
    db.session.commit()  # Сохраняем изменения в базе данных

    return jsonify({
        "id": new_layout_variant1.id,
        "template_lvl1": new_layout_variant1.template_lvl1.id,
        "is_active": new_layout_variant1.is_active,
        "css_style": new_layout_variant1.css_style,
        "html": new_layout_variant1.html
    }), 201  # Возвращаем ответ с данными нового объекта

# PUT update an existing layout_variant_1 item
@bp_layout_variant_1.route("/<int:layout_variant1_id>", methods=["PUT"])
def update_layout_variant1(layout_variant1_id):
    layout_variant1_item = LayoutVariant1.query.get(layout_variant1_id)  # Получаем запись по ID
    if not layout_variant1_item:
        abort(404, description="LayoutVariant1 item not found")  # Если запись не найдена, возвращаем 404

    data = request.get_json()  # Получаем новые данные
    template_lvl1_id = data.get("template_lvl1_id", layout_variant1_item.template_lvl1_id)
    is_active = data.get("is_active", layout_variant1_item.is_active)
    css_style = data.get("css_style", layout_variant1_item.css_style)
    html = data.get("html", layout_variant1_item.html)

    # Получаем связанный объект TemplateLvl1
    template_lvl1 = TemplateLvl1.query.get(template_lvl1_id)
    if not template_lvl1:
        abort(400, description="Invalid template_lvl1_id")  # Проверяем, что объект существует

    # Обновляем объект
    layout_variant1_item.template_lvl1_id = template_lvl1_id
    layout_variant1_item.is_active = is_active
    layout_variant1_item.css_style = css_style
    layout_variant1_item.html = html
    db.session.commit()  # Сохраняем изменения в базе данных

    return jsonify({
        "id": layout_variant1_item.id,
        "template_lvl1": layout_variant1_item.template_lvl1.id,
        "is_active": layout_variant1_item.is_active,
        "css_style": layout_variant1_item.css_style,
        "html": layout_variant1_item.html
    })

# DELETE layout_variant_1 item by ID
@bp_layout_variant_1.route("/<int:layout_variant1_id>", methods=["DELETE"])
def delete_layout_variant1(layout_variant1_id):
    layout_variant1_item = LayoutVariant1.query.get(layout_variant1_id)  # Получаем запись по ID
    if not layout_variant1_item:
        abort(404, description="LayoutVariant1 item not found")  # Если запись не найдена, возвращаем 404

    db.session.delete(layout_variant1_item)  # Удаляем запись
    db.session.commit()  # Сохраняем изменения в базе данных

    return jsonify({"message": f"LayoutVariant1 item {layout_variant1_id} deleted"})  # Возвращаем сообщение о удалении
