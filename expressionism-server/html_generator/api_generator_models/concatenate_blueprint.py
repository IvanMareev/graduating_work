from .api_element_first_level.template import bp as template_bp
from .api_element_first_level.lvl1 import bp_lvl1
from .api_element_first_level.template_lvl1 import bp_template_lvl1
from .api_element_first_level.layout_variant_1 import bp_layout_variant_1
from .api_element_second_level.api_element_second_level import bp_element_second_level
from .api_element_third_level.api_element_third_level import bp_element_third_level
from ..fixing_generation_results import blueprint_fixing_generation_results
from flask import Blueprint

concat_blueprints = Blueprint("template", __name__)

concat_blueprints.register_blueprint(template_bp, url_prefix="/layout_first/templates")
concat_blueprints.register_blueprint(bp_lvl1, url_prefix="/layout_first/lvl1")
concat_blueprints.register_blueprint(bp_template_lvl1, url_prefix="/layout_first/template_lvl1")
concat_blueprints.register_blueprint(bp_layout_variant_1, url_prefix="/layout_first/layout_variant_1")

concat_blueprints.register_blueprint(bp_element_second_level, url_prefix="/layout_second")

concat_blueprints.register_blueprint(bp_element_third_level, url_prefix="/layout_third")


concat_blueprints.register_blueprint(blueprint_fixing_generation_results)