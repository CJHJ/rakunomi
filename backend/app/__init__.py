from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from flask_jwt_extended import JWTManager


app = Flask(__name__)
app.config.from_object(Config)

# plugin
db = SQLAlchemy()
db.init_app(app)
migrate = Migrate()
migrate.init_app(app, db)
CORS(app)
jwt = JWTManager(app)
blacklist = set()


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist


# blueprint
from app.auth import bp as auth_bp
from app.rakuten import bp as rakuten_bp
from app.meeting import bp as meeting_bp
app.register_blueprint(auth_bp)
app.register_blueprint(rakuten_bp)
app.register_blueprint(meeting_bp)


if __name__ == '__main__':
    app.run()

# avoid circular import
from . import models
