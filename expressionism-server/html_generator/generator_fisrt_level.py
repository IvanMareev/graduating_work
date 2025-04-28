from flask import Blueprint, jsonify
from config import db
from sqlalchemy import text
from itertools import combinations, chain, product 
from flask import Response


generate_first_level1_api_blueprint = Blueprint("generate_first_level1", __name__)


@generate_first_level1_api_blueprint.get("/get_first_level1/<int:id>")
def get_first_level1(id):
    sql = text('''
        SELECT layout_variant_1.id, lvl1.name,lvl1.level, layout_variant_1.css_style, layout_variant_1.html, template_lvl1.always_eat, template_lvl1.id as template_lvl1_id
        FROM lvl1
        JOIN template_lvl1 ON template_lvl1.lvl1_id = lvl1.id
        JOIN layout_variant_1 ON layout_variant_1.template_lvl1_id = template_lvl1.id
        WHERE template_lvl1.template_id = :id AND layout_variant_1.is_active
    ''')
    result = db.session.execute(sql, {"id": id})

    # Преобразуем результат в список словарей
    data = [
        {
            'template_lvl1_id': row.template_lvl1_id,
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



# TODO убрать дубликацию кода, заменить логику на get_wireframe_combinations
@generate_first_level1_api_blueprint.get("/getting_all_wireframe_options/<int:id>")
def getting_all_wireframe_options(id):
    all_components = get_first_level1(id)

    # 1. Группируем блоки по name
    groups = {}
    for block in all_components:
        name = block['name']
        if name not in groups:
            groups[name] = []
        groups[name].append(block)

    # 2. Отмечаем обязательные группы
    required_groups = set()
    for name, blocks in groups.items():
        if any(block.get('always_eat') == 1 for block in blocks):
            required_groups.add(name)

    # 3. Подготавливаем варианты выбора для каждой группы
    group_choices = []
    group_names = []

    for name, blocks in groups.items():
        if name in required_groups:
            # Обязательная группа - нужно обязательно выбрать ОДИН из вариантов
            group_choices.append(blocks)
        else:
            # Необязательная группа - можно выбрать один из вариантов или вообще ничего
            group_choices.append(blocks + [None])
        group_names.append(name)

    # 4. Генерируем все комбинации
    all_combinations = []
    for combo in product(*group_choices):
        # Убираем None (если необязательные блоки не выбраны)
        filtered_combo = [block for block in combo if block is not None]
        all_combinations.append(filtered_combo)

    # 5. Генерируем итоговый HTML
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

    for i, combo in enumerate(all_combinations, 1):
        combo.sort(key=lambda block: block["level"])  # Сортируем по level
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


def get_wireframe_combinations(all_components):
    # 1. Группируем блоки по name
    groups = {}
    for block in all_components:
        name = block['name']
        if name not in groups:
            groups[name] = []
        groups[name].append(block)

    # 2. Определяем обязательные группы (если есть always_eat = 1)
    required_groups = set()
    for name, blocks in groups.items():
        if any(block.get('always_eat') == 1 for block in blocks):
            required_groups.add(name)

    # 3. Составляем варианты выбора для каждой группы
    group_choices = []
    for name, blocks in groups.items():
        if name in required_groups:
            group_choices.append(blocks)  # Обязательная группа: выбираем один вариант
        else:
            group_choices.append(blocks + [None])  # Необязательная: можно не выбирать

    # 4. Генерируем все комбинации через декартово произведение
    all_combinations = []
    for combo in product(*group_choices):
        # Убираем None (если блок не выбран)
        filtered_combo = [block for block in combo if block is not None]
        all_combinations.append(filtered_combo)

    return all_combinations


@generate_first_level1_api_blueprint.get("/getting_all_wireframe_components/<int:id>")
def getting_all_wireframe_components(id):
    all_components = get_first_level1(id)
    combinations = get_wireframe_combinations(all_components)
    return jsonify(combinations)


# @generate_first_level1_api_blueprint.get("/get_third_level/<int:id>")
# def get_third_level(id):
#     sql = text('''
#         SELECT lvl3.name, layout_variant_3.css_style, layout_variant_3.html
#         FROM template
#         JOIN template_lvl1 ON template_lvl1.template_id = template.id
#         JOIN template_lvl2 ON template_lvl2.template_lvl1_id = template_lvl1.id
#         JOIN lvl2 ON template_lvl2.lvl2_id = lvl2.id
#         JOIN layout_variant_2 ON layout_variant_2.template_lvl2_id = template_lvl2.id
#     ''')
#     result = db.session.execute(sql, {"id": id})

#     # Преобразуем результат в список словарей
#     data = [
#         {
            
#             "name": row.name,
#             "css_style": row.css_style,
#             "html": row.html
#         }
#         for row in result
#     ]

#     return jsonify(data)
