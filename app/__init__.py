from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()

app = Flask(__name__)
app.config.from_object(Config)

# plugin
db.init_app(app)
migrate.init_app(app, db)

jwt = JWTManager(app)
blacklist = set()
@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist


# blueprint
from app.auth import bp as auth_bp
app.register_blueprint(auth_bp)

if __name__ == '__main__':
    app.run()

from . import models