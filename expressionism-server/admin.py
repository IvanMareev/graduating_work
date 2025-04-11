from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from config import app, db, jwt
from models import (
    Discipline,
    Section,
    Topic,
    TaskGenerator,
    Generator,
    TaskType,
    CourseVariant,
    Task,
    GenerationResult,
    GenerationVariant,
    User,
    TemplateModel,
    Lvl1,
    TemplateLvl1,
    LayoutVariant1
)
from sqlalchemy import inspect

class ChildView(ModelView):
    column_display_pk = True  # optional, but I like to see the IDs in the list
    column_hide_backrefs = False
    column_list = [c_attr.key for c_attr in inspect(TemplateLvl1).mapper.column_attrs]

def init_admin():
    app.config['FLASK_ADMIN_SWATCH'] = 'lumen'
    app.config['FLASK_ADMIN_FLUID'] = False
    admin = Admin(app, name='Admin', template_mode='bootstrap4')

    # Категория для математического анализа
    admin.add_view(ModelView(TemplateModel, db.session, category="генератор html"))
    admin.add_view(ModelView(Lvl1, db.session, category="генератор html"))
    admin.add_view(ModelView(LayoutVariant1, db.session, category="генератор html"))
    admin.add_view(ChildView(TemplateLvl1, db.session, category="генератор html"))

    # Категория для прочих моделей
    admin.add_view(ModelView(Discipline, db.session, category="Мат анализ"))
    admin.add_view(ModelView(Section, db.session, category="Мат анализ"))
    admin.add_view(ModelView(Topic, db.session, category="Мат анализ"))
    admin.add_view(ModelView(TaskGenerator, db.session, category="Мат анализ"))
    admin.add_view(ModelView(Generator, db.session, category="Мат анализ"))
    admin.add_view(ModelView(TaskType, db.session, category="Мат анализ"))
    admin.add_view(ModelView(CourseVariant, db.session, category="Мат анализ"))
    admin.add_view(ModelView(Task, db.session, category="Мат анализ"))
    admin.add_view(ModelView(GenerationResult, db.session, category="Мат анализ"))
    admin.add_view(ModelView(GenerationVariant, db.session, category="Мат анализ"))
    admin.add_view(ModelView(User, db.session, category="Мат анализ"))

    # Добавление представления для TemplateLvl1

