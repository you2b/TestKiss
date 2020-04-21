import time
from app import db
from app.Models.CaseModel import Case
from app.Common.Utils import get_mongo_index
from app.Models.CommonModel import CommonModel


class Product(CommonModel):
    def __init__(self):
        self.table = db['products']


class ProductCategory(CommonModel):
    def __init__(self):
        self.table = db['product_categories']


class ProductVersion(CommonModel):
    def __init__(self):
        self.table = db['product_versions']


class ProductModule(CommonModel):
    def __init__(self):
        self.table = db['product_modules']

    def get_module_tree(self, query, ft="module"):
        r = self.table.find(query, {"_id": 1, "pid": 1, "name": 1, "nt": 1, "st": 1}).sort([("st", 1)])
        cs = Case()
        flt = cs.filter[ft]
        final = []
        tmp = []
        for i in r:
            if i['pid'] == '0':
                final.append(i)
                if i['nt'] == 'leaf':
                    k = i.get('cases', None)
                    if k is None:
                        i['cases'] = []
                    case = cs.table.find({"md": str(i['_id']), "is_del": 0}, flt).sort([("st", 1)])
                    for cc in case:
                        i['cases'].append(cc)
            else:
                tmp.append(i)

        for i in tmp:
            for j in final:
                if i['pid'] == str(j['_id']):
                    if i['nt'] == 'leaf':
                        k = i.get('cases', None)
                        if k is None:
                            i['cases'] = []
                        case = cs.table.find({"md": str(i['_id']), "is_del": 0}, flt).sort([("st", 1)])
                        for cc in case:
                            i['cases'].append(cc)
                    t = j.get('node', None)
                    if t is None:
                        j['node'] = []
                    j['node'].append(i)

        for i in tmp:
            for j in final:
                if 'node' in j:
                    for k in j['node']:
                        if i['pid'] == str(k['_id']):
                            if i['nt'] == 'leaf':
                                m = i.get('cases', None)
                                if m is None:
                                    i['cases'] = []
                                case = cs.table.find({"md": str(i['_id']), "is_del": 0}, flt).sort(
                                    [("st", 1)])
                                for cc in case:
                                    i['cases'].append(cc)
                            t = k.get('node', None)
                            if t is None:
                                k['node'] = []
                            k['node'].append(i)
        return final

    def get_run_tree(self, query, case_ids):
        r = self.table.find(query, {"_id": 1, "pid": 1, "name": 1, "nt": 1, "st": 1}).sort([("st", 1)])
        cs = Case()
        flt = cs.filter["all"]
        final = []
        tmp = []
        for i in r:
            if i['pid'] == '0':
                final.append(i)
                if i['nt'] == 'leaf':
                    k = i.get('cases', None)
                    if k is None:
                        i['cases'] = []
                    case = cs.table.find({"md": str(i['_id']), "_id": {"$in": case_ids}}, flt).sort([("st", 1)])
                    for cc in case:
                        i['cases'].append(cc)
            else:
                tmp.append(i)

        for i in tmp:
            for j in final:
                if i['pid'] == str(j['_id']):
                    if i['nt'] == 'leaf':
                        k = i.get('cases', None)
                        if k is None:
                            i['cases'] = []
                        case = cs.table.find({"md": str(i['_id']), "_id": {"$in": case_ids}}, flt).sort([("st", 1)])
                        for cc in case:
                            i['cases'].append(cc)
                    t = j.get('node', None)
                    if t is None:
                        j['node'] = []
                    j['node'].append(i)

        for i in tmp:
            for j in final:
                if 'node' in j:
                    for k in j['node']:
                        if i['pid'] == str(k['_id']):
                            if i['nt'] == 'leaf':
                                m = i.get('cases', None)
                                if m is None:
                                    i['cases'] = []
                                case = cs.table.find({"md": str(i['_id']), "_id": {"$in": case_ids}}, flt).sort(
                                    [("st", 1)])
                                for cc in case:
                                    i['cases'].append(cc)
                            t = k.get('node', None)
                            if t is None:
                                k['node'] = []
                            k['node'].append(i)
        return final

    def query_or_add(self, product_id, name, pid, nt):
        tb = self.table
        r = tb.find_one({"pd": str(product_id), "pid": str(pid), "name": name})
        if r is not None:
            return str(r["_id"])
        else:
            _id = get_mongo_index('product_module_index')
            d = {
                "_id": _id,
                "pd": str(product_id),
                "name": name,
                "pid": str(pid),
                "nt": nt,
                "st": _id,
                "create_time": time.time(),
                "update_time": time.time()
            }
            r = tb.insert_one(d)
            return str(r.inserted_id)
