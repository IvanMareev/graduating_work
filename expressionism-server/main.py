from flask import jsonify, request, send_from_directory, send_file

from config import app, db
from misc import fill_sample_data
from models import (
    Discipline,
    GenerationResult,
    GenerationVariant,
    CourseVariant,
    Generator,
    Section,
    Task,
    Topic,
    TaskGenerator,
)
from expressionism.generator import GeneratorSystem
from icecream import ic

import json
import os
import time


def server_msg(msg: str, code: int):
    return jsonify({"message": msg}), code


@app.get("/disciplines/<int:discipline_id>/sections")
def get_sections(discipline_id):
    sections = db.session.query(Section).filter_by(discipline_id=discipline_id).all()
    return [s.to_json() for s in sections]


@app.post("/disciplines/<int:discipline_id>/new/section")
def new_section(discipline_id):
    name = request.json.get("name")

    if not name:
        return server_msg("Имя раздела обязательно", 400)

    idx = 0
    unique_name = name
    sections = db.session.query(Section).filter_by(discipline_id=discipline_id)

    while sections.filter_by(name=unique_name).count() > 0:
        idx += 1
        unique_name = f"{name} ({idx})"

    section = Section(name=unique_name, discipline_id=discipline_id)
    db.session.add(section)
    db.session.add(Topic(name="Тема 1", section=section))
    db.session.commit()

    # TODO: add message to response, when section name wont be unique

    return server_msg(f"Успешно создан раздел: {unique_name}", 201)


@app.post("/disciplines/<int:discipline_id>/new/course_variant")
def new_course_variant(discipline_id):
    name = request.json.get("name")

    if not name:
        return server_msg("Название варианта курса обязательно", 400)

    course_variant = CourseVariant(name=name, discipline_id=discipline_id)
    db.session.add(course_variant)
    db.session.commit()

    return server_msg(f"Успешно создан вариант курса: {name}", 201)


@app.route("/edit/section/<int:section_id>", methods=["PATCH"])
def edit_section(section_id):
    section = db.session.get(Section, section_id)

    if not section:
        return server_msg("Раздел не найден", 404)

    section.name = request.json.get("name", section.name)
    db.session.commit()

    return server_msg("Раздел успешно обновлен", 200)


@app.route("/delete/section/<int:section_id>", methods=["DELETE"])
def delete_section(section_id):
    section = db.session.get(Section, section_id)

    if not section:
        return server_msg("Раздел не найден", 404)

    # TODO something do, when sections all deleted
    db.session.delete(section)
    db.session.commit()

    return server_msg("Раздел успешно удален", 200)


@app.route("/sections/<int:section_id>/new/topic", methods=["POST"])
def new_topic(section_id):
    if not db.session.get(Section, section_id):
        return server_msg("Раздел не найден", 404)

    name = request.json.get("name")
    if not name:
        return server_msg("Имя темы обязательно", 400)

    idx = 0
    unique_name = name
    topics = db.session.query(Topic).filter_by(section_id=section_id)

    while topics.filter_by(name=unique_name).count() > 0:
        idx += 1
        unique_name = f"{name} ({idx})"

    db.session.add(Topic(name=unique_name, section_id=section_id))
    db.session.commit()

    return server_msg(f"Успешно создана тема: {unique_name}", 201)


@app.route("/edit/topic/<int:topic_id>", methods=["PATCH"])
def edit_topic(topic_id):
    topic = db.session.get(Topic, topic_id)

    if not topic:
        return server_msg("Тема не найдена", 404)

    topic.name = request.json.get("name", topic.name)
    db.session.commit()

    return server_msg("Тема успешно обновлена", 200)


@app.route("/delete/topic/<int:topic_id>", methods=["DELETE"])
def delete_topic(topic_id):
    topic = db.session.get(Topic, topic_id)

    if not topic:
        return server_msg("Тема не найдена", 204)

    db.session.delete(topic)
    section = db.session.get(Section, topic.section_id)
    if len(section.topics) == 0:
        db.session.add(Topic(name="Тема 1", section=section))
    db.session.commit()

    return server_msg("Тема успешно удалена", 200)


@app.get("/topics/<int:topic_id>")
def get_topic(topic_id):
    topic = db.session.get(Topic, topic_id)

    if not topic:
        return server_msg("Тема не найдена", 204)

    return topic.to_json()


@app.route("/topics/<int:topic_id>/new/generator", methods=["POST"])
def new_generator(topic_id):
    if not db.session.get(Topic, topic_id):
        return server_msg("Тема не найдена", 404)

    name = request.json.get("name")

    if not name:
        return server_msg("Имя генератора обязательно", 400)

    idx = 0
    unique_name = name
    generators = db.session.query(Generator).filter_by(topic_id=topic_id)

    while generators.filter_by(name=unique_name).count() > 0:
        idx += 1
        unique_name = f"{name} ({idx})"

    db.session.add(Generator(name=unique_name, topic_id=topic_id))
    db.session.commit()

    return server_msg(f"Успешно создан генератор: {unique_name}", 201)


@app.patch("/edit/generator/<int:generator_id>")
def edit_generator(generator_id):
    generator = db.session.get(Generator, generator_id)

    if not generator:
        return server_msg("Генератор не найден", 404)

    generator.name = request.json.get("name", generator.name)
    generator.task_text = request.json.get("task_text", generator.task_text)
    generator.variables = request.json.get("variables", generator.variables)
    generator.coefficients = request.json.get("coefficients", generator.coefficients)
    generator.restricts = request.json.get("restricts", generator.restricts)
    generator.content = request.json.get("content", generator.content)

    db.session.commit()

    return server_msg("Генератор успешно обновлен", 200)


@app.delete("/delete/generator/<int:generator_id>")
def delete_generator(generator_id):
    generator = db.session.get(Generator, generator_id)

    if not generator:
        return server_msg("Генератор не найден", 204)

    db.session.delete(generator)
    db.session.commit()

    return server_msg("Генератор успешно удален", 200)


@app.get("/generators/<int:generator_id>")
def get_generator(generator_id):
    generator = db.session.get(Generator, generator_id)

    if not generator:
        return server_msg("Генератор не найден", 204)

    return generator.to_json()


@app.route("/topics/<int:topic_id>/new/task", methods=["POST"])
def new_task(topic_id):
    if not db.session.get(Topic, topic_id):
        return server_msg("Тема не найдена", 404)

    name = request.json.get("name")
    task_type_id = request.json.get("task_type")
    course_variant_id = request.json.get("course_variant")

    if not name:
        return server_msg("Имя задания обязательно", 400)

    if not task_type_id:
        return server_msg("Тип задания обязателен", 400)

    if not course_variant_id:
        return server_msg("Вариант курса обязателен", 400)

    idx = 0
    unique_name = name
    tasks = db.session.query(Task).filter_by(
        topic_id=topic_id, course_variant_id=course_variant_id
    )

    while tasks.filter_by(name=unique_name).count() > 0:
        idx += 1
        unique_name = f"{name} ({idx})"

    db.session.add(
        Task(
            name=unique_name,
            topic_id=topic_id,
            task_type_id=task_type_id,
            course_variant_id=course_variant_id,
        )
    )
    db.session.commit()

    return server_msg(f"Успешно создано задание: {unique_name}", 201)


@app.route("/edit/task/<int:task_id>", methods=["PATCH"])
def edit_task(task_id):
    task = db.session.get(Task, task_id)

    if not task:
        return server_msg("Задание не найдено", 404)

    task.name = request.json.get("name", task.name)
    task.task_type_id = request.json.get("task_type", task.task_type_id)

    db.session.commit()

    return server_msg("Задание успешно отредактировано", 200)


@app.route("/delete/task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = db.session.get(Task, task_id)

    if not task:
        return server_msg("Задание не найдено", 204)

    db.session.delete(task)
    db.session.commit()

    return server_msg("Задание успешно удалено", 200)


@app.get("/tasks/<int:task_id>")
def get_task(task_id):
    task = db.session.get(Task, task_id)

    if not task:
        return server_msg("Задание не найдено", 204)

    task_info = task.to_json()
    task_info["topic"] = {"name": task.topic.name}

    return task_info


@app.get("/disciplines/<int:discipline_id>/course_variants")
def get_course_variants(discipline_id):
    course_variants = (
        db.session.query(CourseVariant).filter_by(discipline_id=discipline_id).all()
    )

    return [cv.to_json() for cv in course_variants]


@app.route("/edit/course_variant/<int:course_variant_id>", methods=["PATCH"])
def edit_course_variant(course_variant_id):
    course_variant = db.session.get(CourseVariant, course_variant_id)

    if not course_variant:
        return server_msg("Вариант курса не найден", 404)

    print(request.json)
    course_variant.name = request.json.get("name", course_variant.name)
    db.session.commit()

    return server_msg("Вариант курса успешно обновлен", 200)


@app.route("/delete/course_variant/<int:course_variant_id>", methods=["DELETE"])
def delete_course_variant(course_variant_id):
    course_variant = db.session.get(CourseVariant, course_variant_id)

    if not course_variant:
        return server_msg("Вариант курса не найден", 204)

    db.session.delete(course_variant)

    discipline = db.session.get(Discipline, course_variant.discipline_id)
    if len(discipline.course_variants) == 0:
        db.session.add(CourseVariant(discipline_id=discipline.id, name="Безымянный"))
    db.session.commit()

    return server_msg("Вариант курса успешно удален", 200)


@app.route("/tasks/<int:task_id>/add/<int:generator_id>", methods=["POST"])
def new_task_generator(task_id, generator_id):
    task = db.session.get(Task, task_id)
    if not task:
        return server_msg("Задание не найдено", 404)

    generator = db.session.get(Generator, generator_id)
    if not generator:
        return server_msg("Генератор не найден", 404)

    task_generator = TaskGenerator(task_id=task_id, generator_id=generator_id)
    db.session.add(task_generator)

    db.session.commit()

    return server_msg("Успешно перемещен генератор в задание", 201)


@app.route("/delete/task_generator/<int:task_generator_id>", methods=["DELETE"])
def delete_task_generator(task_generator_id):
    task_generator = db.session.get(TaskGenerator, task_generator_id)

    if not task_generator:
        return server_msg("Генератор задания не найден", 204)

    db.session.delete(task_generator)
    db.session.commit()

    return server_msg("Генератор задания успешно удален", 200)


@app.get("/tasks/<int:task_id>/results")
def get_task_results(task_id):
    results = db.session.query(GenerationResult).filter_by(task_id=task_id).all()
    return [r.to_json() for r in results]


@app.delete("/delete/results/<int:result_id>")
def delete_result(result_id):
    result = db.session.get(GenerationResult, result_id)

    if not result:
        return server_msg("Результат не найден", 204)

    db.session.delete(result)
    db.session.commit()

    return server_msg("Результат успешно удален", 200)


@app.patch("/edit/results/<int:result_id>")
def edit_result(result_id):
    result = db.session.get(GenerationResult, result_id)

    if not result:
        return server_msg("Результат не найден", 404)

    result.issued = request.json.get("issued", result.issued)

    db.session.commit()

    return server_msg("Результат успешно обновлен", 200)


@app.get("/results/<int:result_id>/variants")
def get_result_variants(result_id):
    variants = db.session.query(GenerationVariant).filter_by(result_id=result_id).all()
    return [v.to_json() for v in variants]


@app.post("/tasks/<int:task_id>/new/generation")
def new_generation(task_id):
    task = db.session.get(Task, task_id)
    db.session.refresh(task)

    if not task:
        return server_msg("Задание не найдено", 404)

    gs = GeneratorSystem()

    variants_count = request.json.get("variants_count", 1)
    generators = [tg.generator for tg in task.generators]
    gen_results = gs.generate(variants_count, generators)
    results_as_json = json.dumps(gen_results)

    result = GenerationResult(
        task_id=task_id,
        name=f"Результат {(len(task.results) + 1)}",
        results=results_as_json,
    )
    db.session.add(result)
    db.session.commit()

    for i in range(0, variants_count):
        db.session.add(GenerationVariant(result_id=result.id))

    db.session.commit()

    return server_msg("Успешно произведена генерация", 201)


@app.get("/variants/<int:variant_id>/document")
def get_variant_document(variant_id):
    variant = db.session.get(GenerationVariant, variant_id)

    if not variant:
        return server_msg("Вариант не найден", 204)

    result = db.session.get(GenerationResult, variant.result_id)

    file_name = f"variant_{result.id}_{variant_id}"
    file_path = f"{app.static_folder}\\{file_name}"

    if os.path.isfile(file_path + ".pdf"):
        return send_from_directory(app.static_folder, file_name + ".pdf")

    variant_index = next(
        (
            index
            for index, variant in enumerate(result.variants)
            if variant.id == variant_id
        ),
        None,
    )

    if variant_index is None:
        return server_msg("Вариант не найден", 404)

    GeneratorSystem.create_variant_pdf(
        json.loads(result.results), variant_index, file_path
    )

    # ic(os.path.isfile(file_path + ".pdf"))
    # time.sleep(1)

    # return send_from_directory(app.static_folder, file_name)
    return send_file(file_path + ".pdf")


@app.get("/results/<int:result_id>/export")
def export_result(result_id):
    result = db.session.get(GenerationResult, result_id)

    if not result:
        return server_msg("Результат не найден", 204)

    file_name = f"result_{result.id}"
    file_path = f"{app.static_folder}\\{file_name}"

    if os.path.isfile(file_path + ".pdf"):
        return send_from_directory(app.static_folder, file_name + ".pdf")

    GeneratorSystem.create_result_pdf(json.loads(result.results), file_path)

    return send_file(file_path + ".pdf")


if __name__ == "__main__":
    with app.app_context():
        # db.drop_all()
        # db.create_all()
        # fill_sample_data(db)

        # Find all old pdf files
        pdf_files = [
            file
            for file in os.listdir(app.static_folder)
            if file.startswith("variant_")
            and file.endswith(".pdf")
            or file.startswith("result_")
            and file.endswith(".pdf")
        ]

        # Remove that PDF files
        for file in pdf_files:
            file_path = os.path.join(app.static_folder, file)
            os.remove(file_path)

    app.run(use_debugger=False, use_reloader=False, passthrough_errors=True)
