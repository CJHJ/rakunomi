from flask import Blueprint

bp = Blueprint('auth', __name__, url_prefix='/api')

from app.auth import routes