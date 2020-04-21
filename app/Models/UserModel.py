import time
from app import db
from app import login_manager as lm
from app.Models.CommonModel import CommonModel
from werkzeug.security import check_password_hash


@lm.user_loader
def load_user(username):
    q = {
        "username": {
            "$regex": username,
            "$options": "$i"
        }
    }
    u = db['users'].find_one(q)
    if not u:
        return None
    return User(u['username'])


class User:
    def __init__(self, username):
        self.username = username
        self.table = db['users']
        self.user = self.get_user()
        self.user_id = self.user['_id']
        self.info = self.user['info']

    @staticmethod
    def is_authenticated():
        return True

    @staticmethod
    def is_active():
        return True

    @staticmethod
    def is_anonymous():
        return False

    def get_avator(self):
        return self.table.find_one({"username": self.username})['info']['avator']

    def get_id(self):
        return self.username

    @staticmethod
    def validate_login(password_hash, password):
        return check_password_hash(password_hash, password)

    def get_user(self):
        q = {
            "username": {
                "$regex": self.username,
                "$options": "$i"
            }
        }
        return self.table.find_one(q)


class UserInfo(CommonModel):
    def __init__(self):
        self.table = db['users']

    def check_user_exists(self, username):
        query = {
            "username": {
                "$regex": username,
                "$options": "$i"
            }
        }
        doc = self.table.find_one(query, {"username": 1})
        if not doc:
            return False
        return True

    def check_email_exists(self, email):
        email = email.lower()
        doc = self.table.find_one({"info.email": email}, {"info": 1})
        if not doc:
            return False
        return True

    def add_user(self, user_info):
        user_info['create_time'] = int(time.time())
        return self.table.insert_one(user_info)

    def count_user(self):
        return self.table.count({})

    def update_user(self, query, info):
        return self.table.update_one(query, info)

    def get_user(self, query):
        return self.table.find_one(query)

    def get_user_list(self, query, field):
        return self.table.find(query, field)


if __name__ == "__main__":
    tm = time.localtime(1569907428.137701)
    ntm = time.strftime("%Y-%m-%d %H:%M:%S", tm)
    print(ntm)
