from flask import Blueprint, jsonify
from config import db
from sqlalchemy import text
from itertools import combinations, chain
from flask import Response
from .generator_second_level import get_intersection_first_level, get_second_level
import copy
from collections import defaultdict


generate_third_level_api_blueprint = Blueprint("generate_third_level", __name__)

def fetch_third_level_blocks(template_id):
    sql = text('''
        SELECT
            lvl3.name                                  AS name,
            lvl3.id                                    AS lvl_id,
            layout_variant_3.css_style                 AS css_style,
            layout_variant_3.html                      AS html,
            template_lvl3.template_lvl2_id             AS template_lvl2_id,
            template_lvl1.id                           AS template_lvl1_id,
            placeholder_match_atoms.code               AS intersection_code
        FROM layout_variant_3
        JOIN template_lvl3
            ON layout_variant_3.template_lvl2_id = template_lvl3.id
        JOIN template_lvl2
            ON template_lvl3.template_lvl2_id = template_lvl2.id
        JOIN template_lvl1
            ON template_lvl2.template_lvl1_id = template_lvl1.id
        JOIN template
            ON template_lvl1.template_id = template.id
        JOIN lvl3
            ON template_lvl3.lvl3_id = lvl3.id
        LEFT JOIN placeholder_match_lvl3
            ON placeholder_match_lvl3.lvl3_id = lvl3.id
        LEFT JOIN placeholder_match_atoms
            ON placeholder_match_atoms.id = placeholder_match_lvl3.placeholder_match_atoms_id
        WHERE
            layout_variant_3.is_active = TRUE
            AND template.id = :id
    ''')

    result = db.session.execute(sql, {"id": template_id})

    return [
        {
            "template_lvl1_id": row.template_lvl1_id,
            "template_lvl2_id": row.template_lvl2_id,
            "intersection_code": row.intersection_code,
            "name": row.name,
            "css_style": row.css_style,
            "html": row.html
        }
        for row in result
    ]


@generate_third_level_api_blueprint.get("/get_third_level/<int:id>")
def get_third_level(id):
    data = fetch_third_level_blocks(id)
    return jsonify(data)


def get_wireframe_combinations_with_suggested_insertion_atoms_options(template_id):
    third_level_blocks = fetch_third_level_blocks(template_id)
    wireframe_combinations = get_intersection_first_level(template_id)

    for combo in wireframe_combinations:
        for combo_element in combo:
            # Находим template_lvl1_id текущего элемента
            template_lvl1_id = combo_element.get("template_lvl1_id")
            if template_lvl1_id is None:
                continue

            # Ищем подходящие блоки второго уровня
            matching_blocks = [
                block for block in third_level_blocks
                if block.get("template_lvl1_id") == template_lvl1_id
            ]

            # Добавляем их как опции вставки
            combo_element["insertion_options"] = matching_blocks

    return wireframe_combinations



@generate_third_level_api_blueprint.get("/get_wireframe_combinations_with_suggested_insertion_atoms_options/<int:id>")
def getting_wireframe_combinations_with_suggested_insertion_atoms_options(id):
    return jsonify(get_wireframe_combinations_with_suggested_insertion_atoms_options(id))


import copy
import itertools
from itertools import product


def get_intersection_second_level(id):
    wireframe_combinations = get_wireframe_combinations_with_suggested_insertion_atoms_options(id)
    updated_combinations = []

    for combo in wireframe_combinations:
        # Пройдем по каждому элементу в комбо и определим все варианты его замен
        list_of_all_element_variants = []

        for combo_element in combo:
            base_html = combo_element["html"]
            base_css = combo_element["css_style"]
            insertion_options = combo_element.get("insertion_options", [])

            # Словарь: плейсхолдер → вставки
            placeholders = {
                code: [opt for opt in insertion_options if opt["intersection_code"] == code]
                for code in set(opt["intersection_code"] for opt in insertion_options)
                if code and isinstance(code, str) and code in base_html
            }

            # Если вставок нет — просто оставляем как есть
            if not placeholders:
                list_of_all_element_variants.append([combo_element])
                continue

            # Генерируем все комбинации вставок
            insertion_combinations = list(itertools.product(*placeholders.values()))
            element_variants = []

            for insert_set in insertion_combinations:
                temp_html = base_html
                temp_css = base_css

                for insertion in insert_set:
                    temp_html = temp_html.replace(insertion["intersection_code"], insertion["html"])
                    temp_css += "\n\n" + insertion["css_style"]

                new_element = copy.deepcopy(combo_element)
                new_element["html"] = temp_html
                new_element["css_style"] = temp_css

                element_variants.append(new_element)

            list_of_all_element_variants.append(element_variants)

        # Теперь собираем все возможные комбинации из вариантов блоков
        for combo_variant in itertools.product(*list_of_all_element_variants):
            updated_combinations.append(list(combo_variant))

    return updated_combinations




@generate_third_level_api_blueprint.get("/getting_intersection_second_level/<int:id>")
def getting_intersection_second_level(id):
    return jsonify(get_intersection_second_level(id))


from flask import Response
from itertools import chain, combinations

@generate_third_level_api_blueprint.get("/getting_all_wireframe_options_with_insertion_atoms/<int:id>")
def getting_all_wireframe_options_with_insertion_atoms(id):
    # Получаем все компоненты для первого уровня
    all_componets_all_combo = get_intersection_second_level(id)

    # Начало HTML-документа
    full_html = """<!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>Комбинации Wireframe</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #fafafa; }
                .combo-block { border: 2px dashed #aaa; padding: 20px; margin: 40px 0; background: #fff; }
                .block-info { font-size: 12px; color: #555; margin-bottom: 10px; }
                h2 { margin-bottom: 20px; }
            </style>
        </head>
        <body>
        <h1>Все комбинации Wireframe</h1>
    """

    combo_counter = 1

    for all_componets in all_componets_all_combo:
        always_eat_blocks = [b for b in all_componets if isinstance(b, dict) and b.get("always_eat") == 1]
        optional_blocks = [b for b in all_componets if isinstance(b, dict) and b.get("always_eat") != 1]

        # Генерация всех возможных комбинаций optional_blocks
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
                if isinstance(block, dict) and block.get('id') not in seen_ids and block.get('name') not in seen_names:
                    seen_ids.add(block.get('id'))
                    seen_names.add(block.get('name'))
                    unique_combo.append(block)

            final_combinations.append(unique_combo)

        # Обработка и вывод всех финальных комбинаций
        for combo in final_combinations:
            combo.sort(key=lambda block: block.get("level", 0))

            combo_styles = "\n".join(block.get("css_style", "") for block in combo)
            combo_html = ""

            for block in combo:
                # block_info = f"""
                #     <div class="block-info">
                #         <strong>ID:</strong> {block.get("id")} |
                #         <strong>Name:</strong> {block.get("name")} |
                #         <strong>Level:</strong> {block.get("level")} |
                #         <strong>Always Eat:</strong> {block.get("always_eat")}
                #     </div>
                # """
                block_html = block.get("html", "")
                combo_html +=  block_html + "<hr/>"

            full_html += f"""
            <div class="combo-block">
                <h2>Комбинация #{combo_counter} (длина {len(combo)})</h2>
                <style>{combo_styles}</style>
                {combo_html}
            </div>
            """
            combo_counter += 1

    full_html += "</body></html>"
    return Response(full_html, mimetype='text/html')


@generate_third_level_api_blueprint.get("/get_third_level_grouped/<int:id>")
def get_third_level_grouped(id):
    from collections import defaultdict
    sql = text('''
        SELECT
            lvl3.name                                              AS name,
            lvl3.id                                                AS lvl_id,
            layout_variant_3.css_style                             AS css_style,
            layout_variant_3.html                                  AS html,
            layout_variant_3.id                                    AS layout_variant_3_id,
            template_lvl3.template_lvl2_id                         AS template_lvl2_id,
            template_lvl1.id                                       AS template_lvl1_id,
            placeholder_match_atoms.code                           AS intersection_code
        FROM layout_variant_3
        JOIN template_lvl3
          ON layout_variant_3.template_lvl2_id = template_lvl3.id
        JOIN template_lvl2
          ON template_lvl3.template_lvl2_id = template_lvl2.id
        JOIN template_lvl1
          ON template_lvl2.template_lvl1_id = template_lvl1.id
        JOIN template
          ON template_lvl1.template_id = template.id
        JOIN lvl3
          ON template_lvl3.lvl3_id = lvl3.id
        LEFT JOIN placeholder_match_lvl3
          ON placeholder_match_lvl3.lvl3_id = lvl3.id
        LEFT JOIN placeholder_match_atoms
          ON placeholder_match_atoms.id = placeholder_match_lvl3.placeholder_match_atoms_id
        WHERE
          layout_variant_3.is_active = TRUE
          AND template.id = :id;
    ''')

    result = db.session.execute(sql, {"id": id})
    grouped = defaultdict(list)

    for row in result:
        grouped[row.name].append({
            "id": row.layout_variant_3_id,
            "intersection_code": row.intersection_code,
            "template_lvl1_id": row.template_lvl1_id,
            "template_lvl2_id": row.template_lvl2_id,
            "name": row.name,
            "css_style": row.css_style,
            "html": row.html,
            "lvl_id": row.lvl_id
        })

    return jsonify(grouped)
