# -*- coding: utf-8 -*-
import re
import json
import base64
import urllib
import hashlib
from app import db
from app import app
from uuid import uuid1
from flask import jsonify


def format_output(data, err, msg):
    return '{{"data":{0},"err":{1},"msg":"{2}"}}'.format(data, err, msg)


def common_response(data=None, err=0, msg=''):
    return jsonify({"data": data, "err": err, "msg": msg})


def list_mongo_res(mg):
    d = []
    for i in mg:
        d.append(i)
    return d


def is_json(content):
    try:
        json.loads(content)
    except ValueError:
        return False
    return True


def base64_encode(content):
    return str(base64.b64encode(content.encode(encoding='utf-8')))


def md5_encode(content):
    hl = hashlib.md5()
    hl.update(content.encode(encoding='utf-8'))
    return hl.hexdigest()


def save_photo(path, src):
    result = re.search("data:image/(?P<ext>.*?);base64,(?P<data>.*)", src, re.DOTALL)
    if result:
        ext = result.groupdict().get("ext")
        image_data = result.groupdict().get("data")
    else:
        raise Exception("解析错误!")
    img = base64.urlsafe_b64decode(image_data)
    filename = "{}.{}".format(uuid1(), ext)
    filepath = "{}/{}".format(path, filename)
    with open(filepath, 'wb') as p:
        p.write(img)
    return filename


def get_mongo_index(table):
    tb = db['tables'].find_and_modify({"_id": table}, {"$inc": {"index": 1}})
    return tb['index']


def gen_pages(page, total):
    if total <= 10:
        return [i for i in range(1, total + 1)]
    page_list = []
    for i in range(1, 6):
        page_list.append(i)
    if page > 5:
        page_list.append('<<')
    if page - 2 > 5 and (page - 2 < total - 4):
        page_list.append(page - 2)
    if page - 1 > 5 and (page - 1 < total - 4):
        page_list.append(page - 1)

    if page > 5 and (page < (total - 4)):
        page_list.append(page)
    if (page + 1) > 5 and ((page + 1) < (total - 4)):
        page_list.append(page + 1)
    if (page + 2) > 5 and (page + 2 < total - 4):
        page_list.append(page + 2)
    if page < (total - 4):
        page_list.append(">>")
    for i in range(total-4, total+1):
        page_list.append(i)
    return page_list


def get_query_url(req):
    params = ""
    for k in req.args:
        if k == "page":
            continue
        params += "{}={}&".format(k, req.args.get(k))
    return params[:-1]


def base64_encode(content):
    return str(base64.b64encode(content.encode(encoding='utf-8')))


def md5_encode(content):
    hl = hashlib.md5()
    hl.update(content.encode(encoding='utf-8'))
    return hl.hexdigest()


def get_next(referer):
    referer = urllib.parse.unquote(referer)
    params = referer.split("&")
    for p in params:
        if p.startswith('next='):
            next_url = p.split('=')[1]
            return next_url
    return '/'


def get_openapi_redirect():
    return app.config.get('SERVER_URL') + '/user/auth'
