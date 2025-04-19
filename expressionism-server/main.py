from config import app, db
from admin import init_admin
from misc import fill_sample_data
from auth_api.auth_api import auth_api_blueprint
from expressionism.api import expressionism_api_blueprint, remove_old_pdfs
from html_generator.generator_fisrt_level import generate_first_level1_api_blueprint
from sqlalchemy import text

app.register_blueprint(expressionism_api_blueprint, url_prefix="/")
app.register_blueprint(auth_api_blueprint, url_prefix="/api/v1")
app.register_blueprint(generate_first_level1_api_blueprint, url_prefix="/api/v1")


if __name__ == "__main__":
    with app.app_context():
        init_admin()
        # db.drop_all()
        db.create_all()
        # db.session.execute(text("ALTER TABLE lvl1 ADD COLUMN level INTEGER;"))
        # db.session.commit()

        # Выполнение второго запроса для добавления lvl3_id
        # db.session.execute(text("ALTER TABLE template_lvl3 ADD COLUMN lvl3_id INTEGER;"))
        # db.session.commit()

        # # Выполнение третьего запроса для добавления always_eat
        # db.session.execute(text("ALTER TABLE template_lvl3 ADD COLUMN always_eat BOOLEAN;"))
        # db.session.commit()

        
        # fill_sample_data(db)
        remove_old_pdfs()

    app.run(debug=True, use_debugger=True, use_reloader=False, passthrough_errors=True)
