import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    # SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = 'postgres://tgdhwxyuknxomp:c79bc55f54e399768234ff92d7f82b9f16614f04d8556aec760f9577cc71f1b3@ec2-50-16-221-180.compute-1.amazonaws.com:5432/d37lksr7hlth0t'
    #  or \ 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
