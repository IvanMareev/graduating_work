import datetime

from flask_sqlalchemy import SQLAlchemy

from models import (
    Discipline,
    GenerationResult,
    GenerationVariant,
    Generator,
    Section,
    Task,
    TaskGenerator,
    TaskType,
    Topic,
)


def fill_sample_data(db: SQLAlchemy):
    discipline = db.session.execute(db.select(Discipline)).scalar_one()

    # Sections
    sets_section = Section(
        name="Множества и действительные числа", discipline=discipline
    )
    db.session.add(sets_section)
    functions_section = Section(
        name="Теория пределов последовательностей и функций", discipline=discipline
    )
    db.session.add(functions_section)
    diff_section = Section(
        name="Дифференциальное исчисление функции одной переменной",
        discipline=discipline,
    )
    db.session.add(diff_section)
    db.session.commit()

    # Topics
    db.session.add(Topic(name="Тема 1", section=sets_section))
    topic1 = Topic(name="Пределы последовательностей", section=functions_section)
    db.session.add(topic1)
    topic2 = Topic(name="Пределы функций", section=functions_section)
    db.session.add(topic2)
    db.session.add(Topic(name="Тема 1", section=diff_section))
    db.session.commit()

    # Generators
    gen1 = Generator(name="Предел `0/0`", topic=topic2)
    db.session.add(gen1)
    gen2 = Generator(name="Предел `\\infty/\\infty`", topic=topic2)
    db.session.add(gen2)
    gen3 = Generator(name="Предел `1/1`", topic=topic2)
    db.session.add(gen3)
    db.session.commit()

    # Tasks
    # ИДЗ id is 1
    # Контрольная работа id is 2
    db.session.add(
        Task(name="ИДЗ 1", course_variant_id=1, task_type_id=1, topic=topic2)
    )
    db.session.add(
        Task(name="ИДЗ 2", course_variant_id=1, task_type_id=1, topic=topic2)
    )
    db.session.add(
        Task(name="ИДЗ 3", course_variant_id=1, task_type_id=1, topic=topic2)
    )
    db.session.add(
        Task(
            name="Контрольная работа 1",
            course_variant_id=1,
            task_type_id=2,
            topic=topic2,
        )
    )
    db.session.add(
        Task(
            name="Контрольная работа 2",
            course_variant_id=1,
            task_type_id=2,
            topic=topic2,
        )
    )
    task1 = Task(
        name="ИДЗ 1",
        course_variant_id=2,
        task_type_id=1,
        topic=topic2,
    )
    db.session.add(task1)
    task2 = Task(
        name="Контрольная работа 1",
        course_variant_id=2,
        task_type_id=2,
        topic=topic2,
    )
    db.session.add(task2)
    db.session.commit()

    db.session.add(TaskGenerator(task=task1, generator=gen1))
    db.session.add(TaskGenerator(task=task1, generator=gen2))
    db.session.add(TaskGenerator(task=task2, generator=gen1))
    db.session.add(TaskGenerator(task=task2, generator=gen2))
    db.session.add(TaskGenerator(task=task2, generator=gen3))

    db.session.commit()
