from flask import Blueprint

bp = Blueprint('rakuten', __name__, url_prefix='/api')
from app.rakuten import routes
