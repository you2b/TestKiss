import os
import pymongo
import logging
from flask import Flask
from flask_cors import CORS
from .jinjia_filters import JJFilters
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from logging.handlers import WatchedFileHandler

app = Flask(__name__)
CORS(app)
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = os.urandom(24)
app.jinja_env.filters['is_odd'] = JJFilters.is_odd
app.jinja_env.filters['unix_2_time'] = JJFilters.unix_2_time

env = os.environ.get('ENV', 'dev')
if env == 'dev':
    app.config.from_object('config.DevConfig')
else:
    app.config.from_object('config.ProductConfig')

db = pymongo.MongoClient(app.config.get("MONGO_URI"), app.config.get("MONGO_PORT"))[app.config.get("MONGO_DB")]


if not os.path.exists(app.config['LOG_ROOT_DIR']):
    os.makedirs(app.config['LOG_ROOT_DIR'])
log_path = app.config['LOG_ROOT_DIR'] + '/wz.log'
handler = WatchedFileHandler(log_path)
handler.setFormatter(logging.Formatter('%(time)s|%(level)s|%(process)d|%(filename)s|%(lineno)s|%(message)s', datefmt='%d/%b/%Y:%H:%M:%S'))
app.logger.setLevel(logging.DEBUG)
app.logger.addHandler(handler)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "/user/login"

from app import blueprints
from app.Models import UserModel
