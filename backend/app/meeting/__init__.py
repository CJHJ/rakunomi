from flask import Blueprint

bp = Blueprint('meeting', __name__, url_prefix='/api')

from app.meeting import routes