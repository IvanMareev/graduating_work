from datetime import datetime

from sqlalchemy import (
    Integer, String, Date, Boolean, Text, ForeignKey, event
)
from sqlalchemy.orm import mapped_column, relationship, Mapped
from passlib.hash import bcrypt
from config import db


class Discipline(db.Model):
    __tablename__ = "discipline"

    id = mapped_column(db.Integer, primary_key=True)
    name = mapped_column(db.String(80), unique=True, nullable=False)
    sections = db.relationship("Section", backref="discipline")
    course_variants = db.relationship("CourseVariant", backref="course_variants")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "sections": [section.to_json() for section in self.sections],
        }


class Section(db.Model):
    __tablename__ = "section"

    id = mapped_column(db.Integer, primary_key=True)
    discipline_id = mapped_column(
        db.Integer, db.ForeignKey("discipline.id"), nullable=False
    )
    name = mapped_column(db.String(80), unique=True, nullable=False)
    topics = db.relationship("Topic", cascade="all,delete", back_populates="section")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "topics": [topic.to_json() for topic in self.topics],
        }


class Topic(db.Model):
    __tablename__ = "topic"

    id = mapped_column(db.Integer, primary_key=True)
    section_id = mapped_column(db.Integer, db.ForeignKey("section.id"), nullable=False)
    name = mapped_column(db.String(80), unique=False, nullable=False)
    generators = db.relationship(
        "Generator", cascade="all,delete", back_populates="topic"
    )
    tasks = db.relationship("Task", cascade="all,delete", back_populates="topic")
    section = db.relationship("Section", back_populates="topics")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "tasks": [task.to_json() for task in self.tasks],
            "generators": [gen.to_json() for gen in self.generators],
        }


class TaskGenerator(db.Model):
    __tablename__ = "task_generator"

    id = mapped_column(db.Integer, primary_key=True)
    task_id = mapped_column(db.Integer, db.ForeignKey("task.id"), nullable=False)
    generator_id = mapped_column(
        db.Integer, db.ForeignKey("generator.id"), nullable=False
    )
    task = db.relationship("Task", back_populates="generators")
    generator = db.relationship("Generator")

    def to_json(self):
        return {
            "id": self.id,
            "generator": self.generator.to_json(),
        }


class Generator(db.Model):
    __tablename__ = "generator"

    id = mapped_column(db.Integer, primary_key=True)
    topic_id = mapped_column(db.Integer, db.ForeignKey("topic.id"), nullable=False)
    name = mapped_column(db.String(120), unique=False, nullable=False)
    topic = db.relationship("Topic", back_populates="generators")
    task_text = mapped_column(db.String(120), unique=False, default="")
    variables = mapped_column(db.Text, nullable=True)
    coefficients = mapped_column(db.Text, nullable=True)
    restricts = mapped_column(db.Text, nullable=True)
    content = mapped_column(db.Text, nullable=True)
    task_generators = db.relationship(
        "TaskGenerator", back_populates="generator", cascade="all,delete"
    )

    def to_json(self):
        return {
            "id": self.id,
            "topic_id": self.topic_id,
            "name": self.name,
            "task_text": self.task_text,
            "variables": self.variables,
            "coefficients": self.coefficients,
            "restricts": self.restricts,
            "content": self.content,
        }


class TaskType(db.Model):
    __tablename__ = "task_type"

    id = mapped_column(db.Integer, primary_key=True)
    name = mapped_column(db.String(80), unique=True, nullable=False)

    def to_json(self):
        return {"id": self.id, "name": self.name}


class CourseVariant(db.Model):
    __tablename__ = "course_variant"

    id = mapped_column(db.Integer, primary_key=True)
    discipline_id = mapped_column(
        db.Integer, db.ForeignKey("discipline.id"), nullable=False
    )
    name = mapped_column(db.String(80), nullable=False)
    tasks = db.relationship(
        "Task", cascade="all,delete", back_populates="course_variant"
    )

    def to_json(self):
        return {"id": self.id, "name": self.name}


class Task(db.Model):
    __tablename__ = "task"

    id = mapped_column(db.Integer, primary_key=True)
    topic_id = mapped_column(db.Integer, db.ForeignKey("topic.id"), nullable=False)
    name = mapped_column(db.String(120), unique=False, nullable=False)
    task_type_id = mapped_column(
        db.Integer, db.ForeignKey("task_type.id"), nullable=False
    )
    task_type = db.relationship("TaskType")
    course_variant_id = mapped_column(
        db.Integer, db.ForeignKey("course_variant.id"), nullable=False
    )
    course_variant = db.relationship("CourseVariant")
    topic = db.relationship("Topic", back_populates="tasks")
    generators: Mapped[list[Generator]] = db.relationship(
        "TaskGenerator", back_populates="task", cascade="all,delete"
    )
    results = db.relationship("GenerationResult", cascade="all,delete")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.task_type.to_json(),
            "course_variant": self.course_variant.to_json(),
            "generators": [generator.to_json() for generator in self.generators],
        }


class GenerationResult(db.Model):
    __tablename__ = "generation_result"

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    task_id: Mapped[int] = mapped_column(
        db.Integer, db.ForeignKey("task.id"), nullable=False
    )
    name = mapped_column(db.String(80), unique=False, nullable=False)
    created_at = mapped_column(db.DateTime, nullable=False, default=datetime.now())
    issued = mapped_column(db.Boolean, nullable=False, default=False)
    results = mapped_column(db.Text, nullable=False)
    variants = db.relationship("GenerationVariant", cascade="all,delete")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at.strftime("%d.%m.%Y"),
            "issued": self.issued,
        }


class GenerationVariant(db.Model):
    __tablename__ = "generation_variant"

    id = mapped_column(db.Integer, primary_key=True)
    result_id = mapped_column(
        db.Integer, db.ForeignKey("generation_result.id"), nullable=False
    )

    def to_json(self):
        return {"id": self.id}

class TemplateModel(db.Model):
    __tablename__ = "template"
    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String, nullable=True)

    def __str__(self):
        return self.name or f"Template #{self.id}"

    def __repr__(self):
        return f"<TemplateModel {self.id}>"



class Lvl1(db.Model):
    __tablename__ = "lvl1"
    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String, nullable=True)

    def __str__(self):
        return self.name or f"Lvl1 #{self.id}"

    def __repr__(self):
        return f"<Lvl1 {self.id}>"


class TemplateLvl1(db.Model):
    __tablename__ = "template_lvl1"

    id = mapped_column(Integer, primary_key=True)

    template_id = mapped_column(Integer, ForeignKey("template.id"), nullable=True)
    template = relationship("TemplateModel")

    lvl1_id = mapped_column(Integer, ForeignKey("lvl1.id"), nullable=True)
    lvl1 = relationship("Lvl1")

    always_eat = mapped_column(Boolean, nullable=True)

    def __str__(self):
        tmpl = self.template.name if self.template else "None"
        lvl = self.lvl1.name if self.lvl1 else "None"
        return f"{tmpl} - {lvl}"

    def __repr__(self):
        return f"<TemplateLvl1 {self.id}>"


class LayoutVariant1(db.Model):
    __tablename__ = "layout_variant_1"

    id = mapped_column(Integer, primary_key=True)

    template_lvl1_id = mapped_column(Integer, ForeignKey("template_lvl1.id"), nullable=True)
    template_lvl1 = relationship("TemplateLvl1")

    css_style = mapped_column(Text, nullable=False)
    html = mapped_column(Text, nullable=False)

    def __str__(self):
        return f"Layout #{self.id} (TemplateLvl1 #{self.template_lvl1_id})"

    def __repr__(self):
        return f"<LayoutVariant1 {self.id}>"


@event.listens_for(Discipline.__table__, "after_create")
def disciplines_default(*args, **kwargs):
    db.session.add(Discipline(name="Математический анализ"))
    db.session.commit()


@event.listens_for(TaskType.__table__, "after_create")
def task_types_default(*args, **kwargs):
    db.session.add(TaskType(name="ИДЗ"))
    db.session.add(TaskType(name="Контрольная работа"))
    db.session.commit()


@event.listens_for(CourseVariant.__table__, "after_create")
def course_variant_default(*args, **kwargs):
    print("Creating default course variants...")
    db.session.add(CourseVariant(discipline_id=1, name="2023"))  # 1
    db.session.add(CourseVariant(discipline_id=1, name="2024"))  # 2
    db.session.commit()
    print("Course variants created!")


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        """Хэширует и сохраняет пароль."""
        self.password_hash = bcrypt.hash(password)

    def check_password(self, password):
        """Проверяет правильность пароля."""
        return bcrypt.verify(password, self.password_hash)