from flask_migrate import Migrate
from flask.cli import FlaskGroup
from config import app, db
from html_generator.generator_fisrt_level import generate_first_level1_api_blueprint
from html_generator.generator_second_level import generate_second_level_api_blueprint
from html_generator.generator_third_level import generate_third_level_api_blueprint
from admin import init_admin
from html_generator.api_generator_models.concatenate_blueprint import concat_blueprints
from expressionism.api import expressionism_api_blueprint

# Регистрация роутов и админки
app.register_blueprint(expressionism_api_blueprint)
app.register_blueprint(generate_first_level1_api_blueprint, url_prefix="/api/v1")
app.register_blueprint(generate_second_level_api_blueprint, url_prefix="/api/v1")
app.register_blueprint(generate_third_level_api_blueprint, url_prefix="/api/v1")

app.register_blueprint(concat_blueprints, url_prefix="/api/v1")
init_admin()
# Настройка миграций
migrate = Migrate(app, db)



@app.route("/")
def index():
    return "Server is running!"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000, use_reloader=True)
