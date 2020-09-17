import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'come-guess'
    EXPIRE_DAYS = 5

    # Database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask_cors
    CORS_HEADERS = 'Content-Type'
