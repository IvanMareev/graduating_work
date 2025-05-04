from flask_migrate import Migrate
from flask.cli import FlaskGroup
from config import app, db
from html_generator.generator_fisrt_level import generate_first_level1_api_blueprint
from html_generator.generator_second_level import generate_second_level_api_blueprint
from html_generator.generator_third_level import generate_third_level_api_blueprint
from admin import init_admin

# Регистрация роутов и админки
app.register_blueprint(generate_first_level1_api_blueprint, url_prefix="/api/v1")
app.register_blueprint(generate_second_level_api_blueprint, url_prefix="/api/v1")
app.register_blueprint(generate_third_level_api_blueprint, url_prefix="/api/v1")
init_admin()

# Настройка миграций
migrate = Migrate(app, db)

# CLI-команда для flask
cli = FlaskGroup(app)

@app.route("/")
def index():
    return "Server is running!"

if __name__ == "__main__":
    cli()
