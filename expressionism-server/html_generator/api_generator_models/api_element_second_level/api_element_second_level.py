from flask import Blueprint, jsonify, request, abort
from models import Lvl2, TemplateLvl2, LayoutVariant2, PlaceholderMatch
from config import db

bp_element_second_level = Blueprint("lvl2_crud", __name__)

# Lvl2 CRUD
@bp_element_second_level.route("/lvl2", methods=["GET"])
def get_all_lvl2():
    lvl2_items = Lvl2.query.all()
    return jsonify([{"id": item.id, "name": item.name} for item in lvl2_items])

@bp_element_second_level.route("/lvl2/<int:lvl2_id>", methods=["GET"])
def get_lvl2(lvl2_id):
    lvl2_item = Lvl2.query.get(lvl2_id)
    if not lvl2_item:
        abort(404, description="Lvl2 not found")
    return jsonify({"id": lvl2_item.id, "name": lvl2_item.name})

@bp_element_second_level.route("/lvl2", methods=["POST"])
def create_lvl2():
    data = request.get_json()
    name = data.get("name")
    new_lvl2 = Lvl2(name=name)
    db.session.add(new_lvl2)
    db.session.commit()
    return jsonify({"id": new_lvl2.id, "name": new_lvl2.name}), 201

@bp_element_second_level.route("/lvl2/<int:lvl2_id>", methods=["PUT"])
def update_lvl2(lvl2_id):
    lvl2_item = Lvl2.query.get(lvl2_id)
    if not lvl2_item:
        abort(404, description="Lvl2 not found")

    data = request.get_json()
    lvl2_item.name = data.get("name", lvl2_item.name)
    db.session.commit()
    return jsonify({"id": lvl2_item.id, "name": lvl2_item.name})

@bp_element_second_level.route("/lvl2/<int:lvl2_id>", methods=["DELETE"])
def delete_lvl2(lvl2_id):
    lvl2_item = Lvl2.query.get(lvl2_id)
    if not lvl2_item:
        abort(404, description="Lvl2 not found")

    db.session.delete(lvl2_item)
    db.session.commit()
    return jsonify({"message": f"Lvl2 {lvl2_id} deleted"})

# TemplateLvl2 CRUD
@bp_element_second_level.route("/template_lvl2", methods=["GET"])
def get_all_template_lvl2():
    template_lvl2_items = TemplateLvl2.query.all()
    return jsonify([{
        "id": item.id,
        "template_lvl1": item.template_lvl1.id if item.template_lvl1 else None,
        "lvl2": item.lvl2.id if item.lvl2 else None,
        "max_count_y": item.max_count_y,
        "min_count_y": item.min_count_y,
        "max_count_x": item.max_count_x,
        "min_count_x": item.min_count_x,
        "always_eat": item.always_eat
    } for item in template_lvl2_items])

@bp_element_second_level.route("/template_lvl2/<int:template_lvl2_id>", methods=["GET"])
def get_template_lvl2(template_lvl2_id):
    template_lvl2_item = TemplateLvl2.query.get(template_lvl2_id)
    if not template_lvl2_item:
        abort(404, description="TemplateLvl2 not found")
    return jsonify({
        "id": template_lvl2_item.id,
        "template_lvl1": template_lvl2_item.template_lvl1.id,
        "lvl2": template_lvl2_item.lvl2.id,
        "max_count_y": template_lvl2_item.max_count_y,
        "min_count_y": template_lvl2_item.min_count_y,
        "max_count_x": template_lvl2_item.max_count_x,
        "min_count_x": template_lvl2_item.min_count_x,
        "always_eat": template_lvl2_item.always_eat
    })

# LayoutVariant2 CRUD
@bp_element_second_level.route("/layout_variant_2", methods=["GET"])
def get_all_layout_variant2():
    layout_variant2_items = LayoutVariant2.query.all()
    return jsonify([{
        "id": item.id,
        "template_lvl2": item.template_lvl2.id if item.template_lvl2 else None,
        "is_active": item.is_active,
        "css_style": item.css_style,
        "html": item.html
    } for item in layout_variant2_items])

@bp_element_second_level.route("/layout_variant_2/<int:layout_variant2_id>", methods=["GET"])
def get_layout_variant2(layout_variant2_id):
    layout_variant2_item = LayoutVariant2.query.get(layout_variant2_id)
    if not layout_variant2_item:
        abort(404, description="LayoutVariant2 not found")
    return jsonify({
        "id": layout_variant2_item.id,
        "template_lvl2": layout_variant2_item.template_lvl2.id,
        "is_active": layout_variant2_item.is_active,
        "css_style": layout_variant2_item.css_style,
        "html": layout_variant2_item.html
    })

# PlaceholderMatch CRUD
@bp_element_second_level.route("/placeholder_match", methods=["GET"])
def get_all_placeholder_match():
    placeholder_matches = PlaceholderMatch.query.all()
    return jsonify([{"id": match.id, "code": match.code} for match in placeholder_matches])

@bp_element_second_level.route("/placeholder_match/<int:placeholder_match_id>", methods=["GET"])
def get_placeholder_match(placeholder_match_id):
    placeholder_match = PlaceholderMatch.query.get(placeholder_match_id)
    if not placeholder_match:
        abort(404, description="PlaceholderMatch not found")
    return jsonify({"id": placeholder_match.id, "code": placeholder_match.code})
