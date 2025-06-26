from flask import request, jsonify, Blueprint
from datetime import datetime
from models import GeneratedLayouts
from .generator_third_level import get_intersection_second_level
from config import db
import uuid

blueprint_fixing_generation_results = Blueprint("fixing_generation_results", __name__)


@blueprint_fixing_generation_results.route("/fixing_generation_results/<int:id>", methods=["POST"])
def fixing_generation_results(id):
    data = request.get_json()
    title = data.get("title", "Без названия")
    is_active = data.get("is_active", True)

    # 🔥 Удаляем все старые GeneratedLayouts с таким же title
    db.session.query(GeneratedLayouts).filter_by(title=title).delete()
    db.session.commit()  # Закрепляем удаление перед вставкой новых данных

    all_combinations = get_intersection_second_level(id)
    saved_ids = []

    for combo_index, combo in enumerate(all_combinations):
        if not combo:
            continue

        group_class = f"group-{combo_index}"

        # Оборачиваем html каждого блока в контейнер
        inner_html = "\n".join(block.get("html", "") for block in combo)
        html_combined = f'<div class="{group_class}">\n{inner_html}\n</div>'

        # Вставляем CSS c префиксом группы
        css_with_prefix = []
        for block in combo:
            raw_css = block.get("css_style", "")
            if raw_css.strip():
                css_with_prefix.append(f".{group_class} {{\n{raw_css}\n}}")

        css_combined = "\n\n".join(css_with_prefix)

        layout = GeneratedLayouts(
            is_active=is_active,
            html=html_combined,
            css_style=css_combined,
            title=title,
            created_at=datetime.utcnow()
        )

        db.session.add(layout)
        db.session.flush()
        saved_ids.append(layout.id)

    db.session.commit()

    return jsonify({
        "message": f"{len(saved_ids)} layouts saved (old with title='{title}' replaced)",
        "ids": saved_ids
    }), 201


     
@blueprint_fixing_generation_results.route("/fixing_generation_results/clear_all", methods=["DELETE"])
def clear_all_generated_layouts():
    try:
        num_deleted = db.session.query(GeneratedLayouts).delete()
        db.session.commit()
        return jsonify({"message": f"Удалено {num_deleted} записей из таблицы generated_layouts"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@blueprint_fixing_generation_results.route("/generated_layouts/by_title/<string:title>", methods=["GET"])
def get_layouts_by_title(title):
    layouts = (
        db.session.query(GeneratedLayouts)
        .filter(GeneratedLayouts.title.ilike(f"%{title}%"))
        .order_by(GeneratedLayouts.created_at.desc())
        .all()
    )

    results = [
        {
            "id": layout.id,
            "title": layout.title,
            "html": layout.html,
            "css_style": layout.css_style,
            "is_active": layout.is_active,
            "created_at": layout.created_at.isoformat(),
        }
        for layout in layouts
    ]

    return jsonify(results)


@blueprint_fixing_generation_results.get("/generated_layouts/search")
def search_layouts():
    query = request.args.get("q", "")
    layouts = (
        db.session.query(GeneratedLayouts)
        .filter(GeneratedLayouts.title.ilike(f"%{query}%"))
        .order_by(GeneratedLayouts.created_at.desc())
        .all()
    )

    results = [
        {
            "id": layout.id,
            "title": layout.title,
            "html": layout.html,
            "css_style": layout.css_style,
            "is_active": layout.is_active,
            "created_at": layout.created_at.isoformat(),
        }
        for layout in layouts
    ]

    return jsonify(results)


@blueprint_fixing_generation_results.route("/generated_layouts/all_titles", methods=["GET"])
def get_all_titles():
    titles = (
        db.session.query(GeneratedLayouts.title, db.func.max(GeneratedLayouts.created_at).label("latest_date"))
        .group_by(GeneratedLayouts.title)
        .order_by(db.func.max(GeneratedLayouts.created_at).desc())
        .all()
    )

    result = [
        {
            "title": title,
            "latest_created_at": latest_date.isoformat()
        }
        for title, latest_date in titles
    ]

    return jsonify(result)
