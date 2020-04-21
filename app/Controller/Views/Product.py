import time
from app import app
from flask_login import login_required, current_user
from flask import Blueprint, request, render_template
from app.Models.ProductModel import Product, ProductCategory, ProductModule, ProductVersion
from app.Common.Utils import common_response, get_mongo_index, get_query_url, list_mongo_res


product = Blueprint('product', __name__)


@product.route('/categories', methods=['GET', 'POST', 'PUT', 'DELETE'])
@login_required
def categories():
    pc = ProductCategory()
    if request.method == "GET":
        r = request.args
        page = r.get('page', 1)
        if page is None:
            page = 1
        data = pc.get_list({}, int(page))
        params = get_query_url(request)
        return render_template('product/categories.html', categories=data, url=request.path, params=params)

    if request.method == "POST":
        r = request.form
        try:
            check = pc.table.find_one({"name": r.get('name')})
            if check is not None:
                return common_response(data='', err=500, msg="产品分类已经存在!")
            if r.get('name') is None:
                return common_response(data='', err=500, msg="产品分类不能为空!")
            d = {
                "_id": get_mongo_index('product_category_index'),
                "name": r.get('name'),
                "desc": r.get('desc'),
                "create_time": time.time(),
                "update_time": time.time()
            }
            pc.table.insert(d)
            return common_response(data={}, err=0, msg="添加成功!")
        except Exception as e:
            app.logger.error(str(e))
            return common_response(data='', err=500, msg=e)

    if request.method == "PUT":
        r = request.form
        _id = r.get('_id', None)
        if _id is None:
            return common_response(data='', err=500, msg="_id不能为空!")

        query = {"_id": int(_id)}
        _update = {"$set": {
            "name": r.get('name'),
            "desc": r.get('desc'),
            "update_time": time.time()
            }
        }
        try:
            pc.table.update_one(query, _update)
            return common_response(data={}, err=0, msg="更新成功")
        except Exception as e:
            app.logger.error(str(e))
            return common_response(data='', err=500, msg=e)

    if request.method == "DELETE":
        r = request.form
        _id = r.get('_id')
        if _id is None:
            return common_response(data='', err=500, msg="id不能为空!")
        try:
            pc.table.delete_one({"_id": int(_id)})
            return common_response(data='', err=0, msg="删除成功")
        except Exception as e:
            app.logger.err(e)
            return common_response(data='', err=500, msg="删除失败!")


@product.route('/categories/all', methods=['GET'])
def categories_all():
    pc = ProductCategory()
    res = pc.table.find({}, {"_id": 1, "name": 1})
    data = list_mongo_res(res)
    return common_response(data=data, err=0, msg="Success")


@product.route('/module/add', methods=['POST'])
def module_add():
    r = request.form
    pm = ProductModule()
    pd = r.get('pd', '')
    pid = r.get('pid', '')
    name = r.get('name', '')
    nt = r.get('nt', '')
    if pd == "" or pid == "" or name == "" or nt == "":
        return common_response(data='', err=500, msg="参数错误,请检查！")
    _id = get_mongo_index('product_module_index')
    d = {
        "_id": _id,
        "pd": pd,
        "name": name,
        "pid": pid,
        "nt": nt,
        "st": _id,
        "create_time": time.time(),
        "update_time": time.time()
    }
    try:
        data = pm.table.insert_one(d)
        return common_response(data={"_id": data.inserted_id}, err=0, msg="添加模块成功!")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg=e)


@product.route('/module/update', methods=['PUT'])
@login_required
def update_module():
    r = request.form
    _id = r.get('_id', "")
    st = r.get('st', "")
    pid = r.get('pid', "")
    nt = r.get('nt', "")
    if _id == "" or st == "" or pid == "":
        return common_response(data='', err=500, msg="参数错误,请检查！")
    pm = ProductModule()
    try:
        _query = {
            "_id": int(_id)
        }
        _update = {
            "$set": {
                "st": int(st),
                "pid": pid
            }
        }
        if nt != "":
            _update['$set']['nt'] = nt
        res = pm.table.update_one(_query, _update)
        print(res.raw_result)
        return common_response(data='', err=0, msg="更新排序成功！")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg=e)


@product.route('/module/delete', methods=['DELETE'])
@login_required
def delete_module():
    r = request.form
    _id = r.get('_id', "")
    if _id == "":
        return common_response(data='', err=500, msg="参数错误,请检查！")
    pm = ProductModule()
    try:
        _query = {
            "_id": int(_id)
        }
        pm.table.delete_one(_query)
        return common_response(data='', err=0, msg="删除成功！")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg=e)


@product.route('/lists', methods=['GET'])
@login_required
def lists():
    pd = Product()
    if request.method == "GET":
        r = request.args
        page = r.get('page', 1)
        if page is None:
            page = 1
        size = r.get('size', 10)
        if size is None:
            size = 10
        data = pd.get_list({}, int(page), int(size))
        params = get_query_url(request)
        return render_template('product/lists.html', products=data, url=request.path, params=params)


@product.route('/add', methods=['POST'])
@login_required
def add():
    r = request.form
    pd = Product()
    name = r.get('name', None)
    if name is None:
        return common_response(data={}, err=500, msg='缺少产品名称！')
    check = pd.table.find_one({"name": name})
    if check is not None:
        return common_response(data=check, err=500, msg='产品名称已存在！')
    try:
        d = {
            "_id": get_mongo_index('products'),
            "name": name,
            "category": r.get('category', None),
            "link": r.get('link', None),
            "desc": r.get('desc', None),
            "owner": current_user.username,
            "create_time": time.time(),
            "update_time": time.time()
        }
        _id = pd.table.insert_one(d)
        return common_response(data={"_id": _id.inserted_id, "name": name}, err=0, msg='产品添加成功！')
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data={}, err=500, msg=e)


@product.route('/del', methods=['DELETE'])
@login_required
def delete():
    pd = Product()
    r = request.form
    _id = r.get('_id', "")
    if _id == "":
        return common_response(data='', err=500, msg="id不能为空!")
    try:
        res = pd.table.delete_one({"_id": int(_id)})
        return common_response(data=res.raw_result, err=0, msg="删除成功")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg="删除失败!")


@product.route('/update', methods=['PUT'])
@login_required
def update():
    pd = Product()
    r = request.form
    _id = r.get('_id', "")
    name = r.get("name", "")
    if _id == "" or name == "":
        return common_response(data='', err=500, msg="id不能为空!")
    query = {
        "_id": int(_id)
    }
    upd = {
        "$set": {
            "name": name,
            "link": r.get("link"),
            "desc": r.get("desc")
        }
    }
    try:
        pd.table.update_one(query, upd)
        return common_response(data='', err=0, msg="更新成功!")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg=e)


@product.route('/version', methods=['GET', 'POST', 'PUT', 'DELETE'])
@login_required
def version():
    r = request
    pv = ProductVersion()
    if r.method == 'POST':
        r = request.form
        product_id = r.get('product_id', '')
        ver = r.get('version', '')
        if product_id.strip() == "":
            return common_response(data='', err=500, msg="产品ID不能为空！")
        if ver.strip() == "":
            return common_response(data='', err=500, msg="产品版本不能为空！")
        product_version = pv.table.find_one({"pd": product_id, "ver": ver})
        if product_version is not None:
            return common_response(data='', err=500, msg="产品版本已存在！")
        d = {
            "_id": get_mongo_index('product_version_index'),
            "pd": product_id,
            "ver": ver
        }
        try:
            data = pv.table.insert_one(d)
            return common_response(data={"_id": data.inserted_id}, err=0, msg="添加产品版本成功！")
        except Exception as e:
            app.logger.error(str(e))
            return common_response(data='', err=500, msg="添加产品版本失败！")


@product.route('/ver/query', methods=['GET'])
def pd_ver():
    r = request.args
    pv = ProductVersion()
    product_id = r.get('product_id', '')
    try:
        data = pv.table.find({"pd": product_id})
        data = list_mongo_res(data)
        return common_response(data=data, err=0, msg="请求成功！")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg="请求失败！")
