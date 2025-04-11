from config import app, db
from admin import init_admin
from misc import fill_sample_data
from auth_api.auth_api import auth_api_blueprint
from expressionism.api import expressionism_api_blueprint, remove_old_pdfs

app.register_blueprint(expressionism_api_blueprint, url_prefix="/")
app.register_blueprint(auth_api_blueprint, url_prefix="/api/v1")


if __name__ == "__main__":
    with app.app_context():
        init_admin()
        db.drop_all()
        db.create_all()

        
        fill_sample_data(db)

        remove_old_pdfs()

    app.run(debug=True, use_debugger=True, use_reloader=False, passthrough_errors=True)
