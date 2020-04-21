from app import db
from app.Models.CommonModel import CommonModel


class Plan(CommonModel):
    def __init__(self):
        self.table = db['plans']
