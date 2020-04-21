from app import db
from app.Models.CommonModel import CommonModel


class Run(CommonModel):
    def __init__(self):
        self.table = db['runs']


class RunCase(CommonModel):
    def __init__(self):
        self.table = db['run_cases']
