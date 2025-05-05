from flask import Blueprint, jsonify, request, abort
from models import TemplateModel
from config import db

bp = Blueprint("template", __name__)

# GET all templates
@bp.route("/", methods=["GET"])
def get_all_templates():
    templates = TemplateModel.query.all()
    return jsonify([{"id": t.id, "name": t.name} for t in templates])

# GET one template by ID
@bp.route("/<int:template_id>", methods=["GET"])
def get_template(template_id):
    template = TemplateModel.query.get(template_id)
    if not template:
        abort(404, description="Template not found")
    return jsonify({"id": template.id, "name": template.name})

# POST create template
@bp.route("/", methods=["POST"])
def create_template():
    data = request.get_json()
    name = data.get("name")
    new_template = TemplateModel(name=name)
    db.session.add(new_template)
    db.session.commit()
    return jsonify({"id": new_template.id, "name": new_template.name}), 201

# PUT update template
@bp.route("/<int:template_id>", methods=["PUT"])
def update_template(template_id):
    template = TemplateModel.query.get(template_id)
    if not template:
        abort(404, description="Template not found")

    data = request.get_json()
    template.name = data.get("name", template.name)
    db.session.commit()
    return jsonify({"id": template.id, "name": template.name})

# DELETE template
@bp.route("/<int:template_id>", methods=["DELETE"])
def delete_template(template_id):
    template = TemplateModel.query.get(template_id)
    if not template:
        abort(404, description="Template not found")

    db.session.delete(template)
    db.session.commit()
    return jsonify({"message": f"Template {template_id} deleted"})
