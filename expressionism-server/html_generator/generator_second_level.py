from flask import Blueprint, jsonify
from config import db
from sqlalchemy import text
from itertools import combinations, chain
from flask import Response
from .generator_fisrt_level import get_wireframe_combinations, get_first_level1
import copy
import re
from collections import defaultdict


generate_second_level_api_blueprint = Blueprint("generate_second_level1", __name__)


def fetch_second_level_blocks(template_id):
    sql = text('''
        SELECT 
            lvl2.name,
            lvl2.id AS lvl2_id,
            layout_variant_2.css_style,
            layout_variant_2.html,
            template_lvl2.template_lvl1_id,
            placeholder_match.code
        FROM layout_variant_2
        JOIN template_lvl2 ON layout_variant_2.template_lvl2_id = template_lvl2.id
        JOIN lvl2 ON template_lvl2.lvl2_id = lvl2.id
        JOIN template_lvl1 ON template_lvl2.template_lvl1_id = template_lvl1.id
        JOIN template ON template_lvl1.template_id = template.id
        LEFT JOIN placeholder_match_lvl2 ON placeholder_match_lvl2.lvl2_id = lvl2.id
        LEFT JOIN placeholder_match ON placeholder_match.id = placeholder_match_lvl2.placeholder_match_id
        WHERE layout_variant_2.is_active = true AND template.id = :id
    ''')


    result = db.session.execute(sql, {"id": template_id})
    
    return [
        {
            "intersection_code": row.code,
            "template_lvl1_id": row.template_lvl1_id,
            "name": row.name,
            "css_style": row.css_style,
            "html": row.html,
            "lvl2_id": row.lvl2_id
        }
        for row in result
    ]


@generate_second_level_api_blueprint.get("/get_second_level/<int:id>")
def get_second_level(id):
    data = fetch_second_level_blocks(id)
    return jsonify(data)


@generate_second_level_api_blueprint.get("/get_second_level_grouped/<int:id>")
def get_second_level_grouped(id):
    sql = text('''
        SELECT 
            lvl2.name, 
            layout_variant_2.css_style, 
            layout_variant_2.html, 
            layout_variant_2.id                         AS layout_variant_2_id,
            template_lvl2.template_lvl1_id, 
            placeholder_match.code, 
            lvl2.id as lvl_id
        FROM template
        JOIN template_lvl1 ON template_lvl1.template_id = template.id
        JOIN template_lvl2 ON template_lvl2.template_lvl1_id = template_lvl1.id
        JOIN lvl2 ON template_lvl2.lvl2_id = lvl2.id
        JOIN layout_variant_2 ON layout_variant_2.template_lvl2_id = template_lvl2.id
        LEFT JOIN placeholder_match_lvl2 ON placeholder_match_lvl2.lvl2_id = lvl2.id
        LEFT JOIN placeholder_match ON placeholder_match.id = placeholder_match_lvl2.placeholder_match_id
        WHERE template.id = :id AND layout_variant_2.is_active = TRUE
    ''')

    result = db.session.execute(sql, {"id": id})

    grouped = defaultdict(list)

    for row in result:
        grouped[row.name].append({
            "id": row.layout_variant_2_id,
            "intersection_code": row.code,
            "template_lvl1_id": row.template_lvl1_id,
            "name": row.name,
            "css_style": row.css_style,
            "html": row.html,
            'lvl_id': row.lvl_id
        })

    return jsonify(grouped)


import re

def get_wireframe_combinations_with_suggested_insertion_options(template_id):
    # Получаем блоки второго уровня с их intersection_code
    second_level_blocks = fetch_second_level_blocks(template_id)  # каждый block должен содержать block["intersection_code"]
    wireframe_combinations = get_wireframe_combinations(get_first_level1(template_id))

    for combo in wireframe_combinations:
        for combo_element in combo:
            html = combo_element.get("html", "")
            if not html:
                continue

            # Собираем все intersection_code, упомянутые в HTML
            found_codes = {
                match.group(1)
                for match in re.finditer(r"#([A-Z0-9_]+)#", html)
            }

            matching_blocks = [
                block for block in second_level_blocks
                if str(block.get("intersection_code") or "").strip("#") in found_codes
            ]




            # Добавляем подходящие блоки
            combo_element["insertion_options"] = matching_blocks

    return wireframe_combinations




@generate_second_level_api_blueprint.get("/get_wireframe_combinations_with_suggested_insertion_options/<int:id>")
def getting_wireframe_combinations_with_suggested_insertion_options(id):
    return jsonify(get_wireframe_combinations_with_suggested_insertion_options(id))


import copy
import itertools

def get_intersection_first_level(id):
    wireframe_combinations = get_wireframe_combinations_with_suggested_insertion_options(id)
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




@generate_second_level_api_blueprint.get("/getting_intersection_first_level/<int:id>")
def getting_intersection_first_level(id):
    return jsonify(get_intersection_first_level(id))


def scope_css(css, prefix):
    """
    Добавляет префикс к каждому CSS-селектору для изоляции стилей.
    """
    scoped = []
    for rule in css.split("}"):
        if "{" in rule:
            selector, body = rule.split("{", 1)
            # Добавляем префикс ко всем селекторам через запятую
            scoped_selectors = ", ".join(
                f".{prefix} {sel.strip()}" for sel in selector.split(",") if sel.strip()
            )
            scoped.append(f"{scoped_selectors} {{{body}}}")
    return "\n".join(scoped)


from flask import Response
from itertools import chain, combinations

@generate_second_level_api_blueprint.get("/getting_all_wireframe_options_with_insertion/<int:id>")
def getting_all_wireframe_options_with_insertion(id):
    # Получаем все компоненты для первого уровня
    all_componets_all_combo = get_intersection_first_level(id)

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

            unique_class = f"combo-{combo_counter}"
            combo_styles = "\n".join(scope_css(block.get("css_style", ""), unique_class) for block in combo)
            combo_html = ""

            for block in combo:
                block_info = f"""
                    <div class="block-info">
                        <strong>ID:</strong> {block.get("id")} |
                        <strong>Name:</strong> {block.get("name")} |
                        <strong>Level:</strong> {block.get("level")} |
                        <strong>Always Eat:</strong> {block.get("always_eat")}
                    </div>
                """
                block_html = block.get("html", "")
                combo_html += f"""
                    <div class="{unique_class}">
                        {block_info}
                        {block_html}
                    </div>
                    <hr/>
                """

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


