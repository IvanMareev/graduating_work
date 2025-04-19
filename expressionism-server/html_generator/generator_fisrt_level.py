from flask import Blueprint, jsonify
from config import db
from sqlalchemy import text
from itertools import combinations, chain
from flask import Response


generate_first_level1_api_blueprint = Blueprint("generate_first_level1", __name__)


@generate_first_level1_api_blueprint.get("/get_first_level1/<int:id>")
def get_first_level1(id):
    sql = text('''
        SELECT layout_variant_1.id, lvl1.name,lvl1.level, layout_variant_1.css_style, layout_variant_1.html, template_lvl1.always_eat
        FROM lvl1
        JOIN template_lvl1 ON template_lvl1.lvl1_id = lvl1.id
        JOIN layout_variant_1 ON layout_variant_1.template_lvl1_id = template_lvl1.id
        WHERE template_lvl1.template_id = :id
    ''')
    result = db.session.execute(sql, {"id": id})

    # Преобразуем результат в список словарей
    data = [
        {
            "id": row.id,
            "always_eat": row.always_eat,
            "name": row.name,
            "level": row.level,
            "css_style": row.css_style,
            "html": row.html
        }
        for row in result
    ]

    return (data)


@generate_first_level1_api_blueprint.get("/getting_all_wireframe_options/<int:id>")
def getting_all_wireframe_options(id):
    all_componets = get_first_level1(id)

    always_eat_blocks = [b for b in all_componets if b.get("always_eat") == 1]
    optional_blocks = [b for b in all_componets if b.get("always_eat") != 1]

    optional_combinations = list(chain.from_iterable(
        combinations(optional_blocks, r) for r in range(0, len(optional_blocks) + 1)
    ))

    final_combinations = []

    for combo in optional_combinations:
        full_combo = list(always_eat_blocks) + list(combo)

        # Убираем дубликаты по id и name
        seen_ids = set()
        seen_names = set()
        unique_combo = []

        for block in full_combo:
            if block['id'] not in seen_ids and block['name'] not in seen_names:
                seen_ids.add(block['id'])
                seen_names.add(block['name'])
                unique_combo.append(block)

        final_combinations.append(unique_combo)

    # Собираем итоговый HTML
    full_html = """<!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>Комбинации Wireframe</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #fafafa; }
                .combo-block { border: 2px dashed #aaa; padding: 20px; margin: 40px 0; background: #fff; }
                h2 { margin-bottom: 20px; }
            </style>
        </head>
        <body>
        <h1>Все комбинации Wireframe</h1>
                """

    for i, combo in enumerate(final_combinations, 1):
        combo.sort(key=lambda block: block["level"])
        combo_styles = "\n".join(block["css_style"] for block in combo)
        combo_html = "\n".join(block["html"] for block in combo)

        full_html += f"""
        <div class="combo-block">
            <h2>Комбинация #{i} (длина {len(combo)})</h2>
            <style>{combo_styles}</style>
            {combo_html}
        </div>
        """

    full_html += "</body></html>"
    return Response(full_html, mimetype='text/html')    






@generate_first_level1_api_blueprint.get("/get_second_level/<int:id>")
def get_second_level(id):
    sql = text('''
        SELECT lvl2.name, layout_variant_2.css_style, layout_variant_2.html
        FROM template
        JOIN template_lvl1 ON template_lvl1.template_id = template.id
        JOIN template_lvl2 ON template_lvl2.template_lvl1_id = template_lvl1.id
        JOIN lvl2 ON template_lvl2.lvl2_id = lvl2.id
        JOIN layout_variant_2 ON layout_variant_2.template_lvl2_id = template_lvl2.id
    ''')
    result = db.session.execute(sql, {"id": id})

    # Преобразуем результат в список словарей
    data = [
        {
            "name": row.name,
            "css_style": row.css_style,
            "html": row.html
        }
        for row in result
    ]

    return jsonify(data)

@generate_first_level1_api_blueprint.get("/get_third_level/<int:id>")
def get_third_level(id):
    sql = text('''
        SELECT lvl3.name, layout_variant_3.css_style, layout_variant_3.html
        FROM template
        JOIN template_lvl1 ON template_lvl1.template_id = template.id
        JOIN template_lvl2 ON template_lvl2.template_lvl1_id = template_lvl1.id
        JOIN lvl2 ON template_lvl2.lvl2_id = lvl2.id
        JOIN layout_variant_2 ON layout_variant_2.template_lvl2_id = template_lvl2.id
    ''')
    result = db.session.execute(sql, {"id": id})

    # Преобразуем результат в список словарей
    data = [
        {
            
            "name": row.name,
            "css_style": row.css_style,
            "html": row.html
        }
        for row in result
    ]

    return jsonify(data)
