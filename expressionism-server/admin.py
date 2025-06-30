from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin.form.widgets import Select2Widget
from wtforms_sqlalchemy.fields import QuerySelectMultipleField
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
    LayoutVariant1,
    Lvl2,
    TemplateLvl2,
    LayoutVariant2,
    Lvl3,
    TemplateLvl3,
    LayoutVariant3,
    PlaceholderMatch,
    PlaceholderMatchAtoms,
    GeneratedLayouts

)
from sqlalchemy import inspect


class ChildView(ModelView):
    column_display_pk = True  # optional, but I like to see the IDs in the list
    column_hide_backrefs = False
    column_list = [c_attr.key for c_attr in inspect(TemplateLvl1).mapper.column_attrs]


class PlaceholderMatchAdmin(ModelView):
    form_overrides = {
        'lvl2_items': QuerySelectMultipleField
    }
    form_args = {
        'lvl2_items': {
            'query_factory': lambda: db.session.query(Lvl2),  # ✅
            'get_label': 'name'
        }
    }

class PlaceholderMatchAtomsAdmin(ModelView):
    form_overrides = {
        'lvl3_items': QuerySelectMultipleField
    }
    form_args = {
        'lvl3_items': {
            'query_factory': lambda: db.session.query(Lvl3),  # ✅
            'get_label': 'name'
        }
    }


def init_admin():
    app.config['FLASK_ADMIN_SWATCH'] = 'lumen'
    app.config['FLASK_ADMIN_FLUID'] = False
    admin = Admin(app, name='Admin', template_mode='bootstrap4')

    # Категория для математического анализа
    admin.add_view(ModelView(TemplateModel, db.session, name="Шаблоны", category="Уровень 1 (Каркас)"))
    admin.add_view(ModelView(Lvl1, db.session, name="Регистрация функциональных элементов", category="Уровень 1 (Каркас)"))
    admin.add_view(ModelView(LayoutVariant1, db.session, name="Вариации вертски", category="Уровень 1 (Каркас)"))
    admin.add_view(ModelView(TemplateLvl1, db.session,name="Связка шаблона и вариантов верстки", category="Уровень 1 (Каркас)"))

    admin.add_view(ModelView(TemplateLvl2, db.session, name="Связка шаблона и вариантов функциональных элементов(связь с 1 уровнем)", category="Уровень 2 (Элементы)"))
    admin.add_view(ModelView(Lvl2, db.session, name="Элементы", category="Уровень 2 (Элементы)"))
    admin.add_view(ModelView(LayoutVariant2, db.session, name="Вариации верстки элементов", category="Уровень 2 (Элементы)"))

    admin.add_view(PlaceholderMatchAdmin(PlaceholderMatch, db.session,name="Код лоцирования элементов в lvl1",category="Уровень 2 (Элементы)"))

    admin.add_view(ModelView(TemplateLvl3, db.session, name="Связка элемента и атомарной его части", category="Уровень 3 (Атомы)"))
    admin.add_view(ModelView(Lvl3, db.session, name="Атомы", category="Уровень 3 (Атомы)"))
    admin.add_view(ModelView(LayoutVariant3, db.session, name="Вариации верстки атомов", category="Уровень 3 (Атомы)"))

    admin.add_view(PlaceholderMatchAtomsAdmin(PlaceholderMatchAtoms, db.session, name="Код лоцирования элементов в lvl2",category="Уровень 3 (Атомы)"))

    admin.add_view(ModelView(GeneratedLayouts, db.session, name="Результаты генерации"))

    

    # Категория для прочих моделей
    admin.add_view(ModelView(Discipline, db.session, category="Структура курса"))
    admin.add_view(ModelView(Section, db.session, category="Структура курса"))
    admin.add_view(ModelView(Topic, db.session, category="Структура курса"))
    admin.add_view(ModelView(TaskGenerator, db.session, category="Структура курса"))
    admin.add_view(ModelView(Generator, db.session, category="Структура курса"))
    admin.add_view(ModelView(TaskType, db.session, category="Структура курса"))
    admin.add_view(ModelView(CourseVariant, db.session, category="Структура курса"))
    admin.add_view(ModelView(Task, db.session, category="Структура курса"))
    admin.add_view(ModelView(GenerationResult, db.session, category="Структура курса"))
    admin.add_view(ModelView(GenerationVariant, db.session, category="Структура курса"))
    admin.add_view(ModelView(User, db.session, category="Структура курса"))

    # Добавление представления для TemplateLvl1

