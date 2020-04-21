# -*- coding: utf-8 -*-
from app import app
from app.Controller.Views.User import user
from app.Controller.Views.Home import home
from app.Controller.Views.Case import case
from app.Controller.Views.Plan import plan
from app.Controller.Views.Run import run
from app.Controller.Views.Report import report
from app.Controller.Views.Product import product

app.register_blueprint(user, url_prefix='/user')
app.register_blueprint(home, url_prefix='/')
app.register_blueprint(case, url_prefix='/case')
app.register_blueprint(plan, url_prefix='/plan')
app.register_blueprint(run, url_prefix='/run')
app.register_blueprint(report, url_prefix='/report')
app.register_blueprint(product, url_prefix='/product')
