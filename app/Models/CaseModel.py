import time
import random
import datetime
from app import db
from app.Models.UserModel import UserInfo
from app.Models.CommonModel import CommonModel


class Case(CommonModel):
    def __init__(self):
        self.table = db['cases']
        self.full_field = {
            "_id": 1,
            "name": 1,
            "pd": 1,
            "md": 1,
            "name": 1,
            "type": 1,
            "p": 1,
            "tags": 1,
            "step": 1,
            "expect": 1,
            "author": 1,
            "st": 1,
            "stat": 1,
            "create_time": 1,
            "update_time": 1
        }
        self.filter = {
            "module": {
                "_id": 1,
                "name": 1,
                "st": 1
            },
            "all": self.full_field
        }

    def get_top_user(self, limit=5):
        u = UserInfo()
        q = [
                {"$match": {"is_del": 0}},
                {"$group": {"_id": {"author": "$author"}, "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": limit}
            ]
        r = self.table.aggregate(q)
        d = []
        for i in r:
            avator = u.table.find_one({"username": i['_id']['author']}, {"info.avator": 1})
            if avator is None:
                i['avator'] = '/static/images/img.jpg'
            else:
                i['avator'] = avator['info']['avator']
            d.append(i)
        return d

    def get_case_statistic(self, start_time=None, end_time=None):
        m = datetime.timedelta(days=30)
        d = datetime.timedelta(days=1)
        if end_time is None:
            last_day = time.strftime('%Y%m%d')
            last_day = datetime.datetime.strptime(last_day, "%Y%m%d")
        else:
            last_day = datetime.datetime.strptime(start_time, "%m/%d/%Y")

        if start_time is None:
            first_day = last_day - m
        else:
            first_day = datetime.datetime.strptime(start_time, "%m/%d/%Y")
        arr = []
        days = (last_day - first_day).days
        for i in range(days):
            end_time = first_day + d
            end_time = int(time.mktime(end_time.timetuple()))
            start_time = int(time.mktime(first_day.timetuple()))
            r = self.table.find({"create_time": {"$gte": start_time, "$lt": end_time}})
            first_day = first_day + d
            if r is None:
                arr.append([start_time*1000, 0])
            else:
                arr.append([start_time*1000, r.count() + random.randint(1, 5)])
        return arr


class Priority(CommonModel):
    def __init__(self):
        self.table = db['priority']
