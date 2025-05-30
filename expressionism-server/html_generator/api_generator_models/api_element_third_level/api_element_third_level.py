from flask import Blueprint, jsonify, request, abort
from config import db
from models import Lvl3, PlaceholderMatchAtoms, TemplateLvl3, LayoutVariant3

bp_element_third_level = Blueprint("lvl3", __name__)

# ---- CRUD for Lvl3 ----
@bp_element_third_level.route("/items", methods=["GET"])
def get_lvl3_items():
    items = Lvl3.query.all()
    return jsonify([{ "id": item.id, "name": item.name } for item in items])

@bp_element_third_level.route("/items", methods=["POST"])
def create_lvl3():
    data = request.get_json()
    item = Lvl3(name=data.get("name"))
    db.session.add(item)
    db.session.commit()
    return jsonify({"id": item.id, "name": item.name}), 201

@bp_element_third_level.route("/items/<int:item_id>", methods=["PUT"])
def update_lvl3(item_id):
    item = Lvl3.query.get_or_404(item_id)
    data = request.get_json()
    item.name = data.get("name", item.name)
    db.session.commit()
    return jsonify({"id": item.id, "name": item.name})

@bp_element_third_level.route("/items/<int:item_id>", methods=["DELETE"])
def delete_lvl3(item_id):
    item = Lvl3.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": f"Lvl3 {item_id} deleted"})


# ---- CRUD for PlaceholderMatchAtoms ----
@bp_element_third_level.route("/placeholder_match_atoms", methods=["GET"])
def get_placeholder_atoms():
    items = PlaceholderMatchAtoms.query.all()
    return jsonify([{ "id": item.id, "code": item.code } for item in items])

@bp_element_third_level.route("/placeholder_match_atoms", methods=["POST"])
def create_placeholder_atoms():
    data = request.get_json()
    item = PlaceholderMatchAtoms(code=data["code"])
    db.session.add(item)
    db.session.commit()
    return jsonify({"id": item.id, "code": item.code}), 201

@bp_element_third_level.route("/placeholder_match_atoms/<int:item_id>", methods=["PUT"])
def update_placeholder_atoms(item_id):
    item = PlaceholderMatchAtoms.query.get_or_404(item_id)
    data = request.get_json()
    item.code = data.get("code", item.code)
    db.session.commit()
    return jsonify({"id": item.id, "code": item.code})

@bp_element_third_level.route("/placeholder_match_atoms/<int:item_id>", methods=["DELETE"])
def delete_placeholder_atoms(item_id):
    item = PlaceholderMatchAtoms.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": f"PlaceholderMatchAtoms {item_id} deleted"})


# ---- CRUD for TemplateLvl3 ----
@bp_element_third_level.route("/template_lvl3", methods=["GET"])
def get_template_lvl3():
    items = TemplateLvl3.query.all()
    return jsonify([{
        "id": item.id,
        "template_lvl2_id": item.template_lvl2_id,
        "lvl3_id": item.lvl3_id,
        "always_eat": item.always_eat
    } for item in items])

@bp_element_third_level.route("/template_lvl3", methods=["POST"])
def create_template_lvl3():
    data = request.get_json()
    item = TemplateLvl3(
        template_lvl2_id=data.get("template_lvl2_id"),
        lvl3_id=data.get("lvl3_id"),
        always_eat=data.get("always_eat")
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"id": item.id}), 201

@bp_element_third_level.route("/template_lvl3/<int:item_id>", methods=["PUT"])
def update_template_lvl3(item_id):
    item = TemplateLvl3.query.get_or_404(item_id)
    data = request.get_json()
    item.template_lvl2_id = data.get("template_lvl2_id", item.template_lvl2_id)
    item.lvl3_id = data.get("lvl3_id", item.lvl3_id)
    item.always_eat = data.get("always_eat", item.always_eat)
    db.session.commit()
    return jsonify({"id": item.id})

@bp_element_third_level.route("/template_lvl3/<int:item_id>", methods=["DELETE"])
def delete_template_lvl3(item_id):
    item = TemplateLvl3.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": f"TemplateLvl3 {item_id} deleted"})


# ---- CRUD for LayoutVariant3 ----
@bp_element_third_level.route("/layout_variant_3", methods=["GET"])
def get_layout_variant_3():
    items = LayoutVariant3.query.all()
    return jsonify([{
        "id": item.id,
        "template_lvl2_id": item.template_lvl2_id,
        "is_active": item.is_active,
        "css_style": item.css_style,
        "html": item.html
    } for item in items])

@bp_element_third_level.route("/layout_variant_3", methods=["POST"])
def create_layout_variant_3():
    data = request.get_json()
    item = LayoutVariant3(
        template_lvl2_id=data.get("template_lvl2_id"),
        is_active=data.get("is_active"),
        css_style=data["css_style"],
        html=data["html"]
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"id": item.id}), 201

@bp_element_third_level.route("/layout_variant_3/<int:layout_variant3_id>", methods=["PUT"])
def update_layout_variant3(layout_variant3_id):
    layout_variant3_item = LayoutVariant3.query.get(layout_variant3_id)
    if not layout_variant3_item:
        abort(404, description="LayoutVariant3 item not found")

    data = request.get_json()
    template_lvl2_id = data.get("template_lvl2_id", layout_variant3_item.template_lvl2_id)
    is_active = data.get("is_active", layout_variant3_item.is_active)
    css_style = data.get("css_style", layout_variant3_item.css_style)
    html = data.get("html", layout_variant3_item.html)

    # Проверка существования TemplateLvl3
    template_lvl2 = TemplateLvl3.query.get(template_lvl2_id)
    if not template_lvl2:
        abort(400, description="Invalid template_lvl2_id")

    # Обновление полей
    layout_variant3_item.template_lvl2_id = template_lvl2_id
    layout_variant3_item.is_active = is_active
    layout_variant3_item.css_style = css_style
    layout_variant3_item.html = html

    db.session.commit()

    return jsonify({
        "id": layout_variant3_item.id,
        "template_lvl2_id": layout_variant3_item.template_lvl2_id,
        "is_active": layout_variant3_item.is_active,
        "css_style": layout_variant3_item.css_style,
        "html": layout_variant3_item.html
    })

@bp_element_third_level.route("/layout_variant_3/<int:layout_variant3_id>", methods=["GET"])
def get_layout_variant3(layout_variant3_id):
    layout_variant3_item = LayoutVariant3.query.get(layout_variant3_id)
    if not layout_variant3_item:
        abort(404, description="LayoutVariant3 not found")
    return jsonify({
        "id": layout_variant3_item.id,
        "template_lvl3": layout_variant3_item.template_lvl2.id,
        "is_active": layout_variant3_item.is_active,
        "css_style": layout_variant3_item.css_style,
        "html": layout_variant3_item.html
    })

@bp_element_third_level.route("/layout_variant_3/<int:item_id>", methods=["PUT"])
def update_layout_variant_3(item_id):
    item = LayoutVariant3.query.get_or_404(item_id)
    data = request.get_json()
    item.template_lvl2_id = data.get("template_lvl2_id", item.template_lvl2_id)
    item.is_active = data.get("is_active", item.is_active)
    item.css_style = data.get("css_style", item.css_style)
    item.html = data.get("html", item.html)
    db.session.commit()
    return jsonify({"id": item.id})

@bp_element_third_level.route("/layout_variant_3/<int:item_id>", methods=["DELETE"])
def delete_layout_variant_3(item_id):
    item = LayoutVariant3.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": f"LayoutVariant3 {item_id} deleted"})
