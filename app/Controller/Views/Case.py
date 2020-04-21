import json
import time
import xlrd
from app import app
from app.Models.CaseModel import Case
from flask_login import login_required, current_user
from app.Models.ProductModel import Product, ProductModule
from app.Common.Utils import get_query_url, common_response, get_mongo_index
from flask import Blueprint, request, redirect, url_for, render_template, flash


case = Blueprint('case', __name__)


@case.route('/', methods=['GET'])
@login_required
def dashboard():
        r = request.args
        pd = Product()
        page = r.get('page', 1)
        size = r.get('size', 16)
        if size is None:
            size = 10
        if page is None:
            page = 1
        search = r.get('search', None)
        if search is None:
            search = {}
        else:
            search = {
                "name": {
                    "$regex": search
                }
            }
        products = pd.get_list(search, int(page), int(size))
        params = get_query_url(request)
        return render_template('case/choose_pd.html', products=products, url=request.path, params=params)


@case.route('/lists', methods=['GET'])
@login_required
def lists():
        r = request.args
        product_id = r.get('product_id', '')
        if product_id == '':
                flash("产品ID不存在！")
                return redirect(url_for('case.dashboard'))
        pd = Product()
        product = pd.table.find_one({"_id": int(product_id)})
        if product is None:
                return redirect(url_for('case.dashboard'))
        pm = ProductModule()
        modules = pm.get_module_tree({"pd": product_id}, 'all')
        return render_template('case/case.html', product=product, modules=modules)


@case.route('/edits', methods=['GET'])
@login_required
def edit_cases():
        r = request.args
        product_id = r.get('product_id', '')
        if product_id == '':
                flash("产品ID不存在！")
                return redirect(url_for('case.dashboard'))
        pd = Product()
        product = pd.table.find_one({"_id": int(product_id)})
        if product is None:
                return redirect(url_for('case.dashboard'))
        pm = ProductModule()
        modules = pm.get_module_tree({"pd": product_id})
        return render_template('case/edit.case.html', product=product, modules=modules)


@case.route('/delete', methods=['DELETE'])
@login_required
def delete_case():
    r = request.form
    cs = Case()
    _id = r.get('_id', '')
    if _id.strip() == "":
        return common_response(data='', err=500, msg="_id 参数不能为空！")
    try:
        data = cs.table.update_one({"_id": int(_id)}, {"$set": {"is_del": 1}})
        return common_response(data=data.raw_result, err=0, msg="删除成功！")
    except Exception as e:
        app.logger.error("删除失败")
        app.logger.error(str(e))
        return common_response(data='', err=500, msg=e)


@case.route('/sort', methods=['PUT'])
@login_required
def sort_case():
    r = request.form
    cs = Case()
    _id = r.get('_id', '')
    md = r.get('md', '')
    st = r.get('st', '')
    err = {}
    if _id.strip() == "":
        err['_id'] = "_id 参数不能为空!"
    if md.strip() == "":
        err['md'] = "case 模块不能为空!"
    if st.strip() == "":
        err['st'] = "排序参数不能为空!"
    if len(err) > 0:
        return common_response(data='', err=500, msg=json.dumps(err))
    try:
        query = {
            "_id": int(_id)
        }
        update = {
            "$set":{
                "md": md,
                "st": int(st)
            }
        }
        cs.table.update_one(query, update)
        return common_response(data='', err=0, msg="更新成功")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg=e)


@case.route('/add', methods=['POST'])
@login_required
def add():
    r = request.form
    pd = Product()
    pm = ProductModule()
    cs = Case()
    product_id = r.get('pd', '')
    module_id = r.get('md', '')
    name = r.get('name', "")
    type_ = r.get('type', "")
    priority = r.get('p', '')
    tags = r.get('tags', "").strip()
    step = r.get('step', "")
    expect_ = r.get('expect', "")
    err = {}
    if product_id == "":
        err['product'] = "缺少pd参数！"
    if module_id == "":
        err['module'] = "缺少md参数！"
    md_exist = pm.table.find_one({"_id": int(module_id)})
    pd_exist = pd.table.find_one({"_id": int(product_id)})
    if pd_exist is None:
        err['product'] = "product_id 不存在！"
    if md_exist is None:
        err['module'] = "module_id 不存在！"
    if name.strip() == "":
        err['name'] = "用例名称: name 不能为空！"
    if type_.strip() == "":
        err['type'] = "用例类型type不能为空！"
    if step.strip() == "":
        err['step'] = "测试步骤不能为空!"
    if expect_.strip() == "":
        err['expect'] = "预期结果：expect 不能为空！"
    if len(err) > 0:
        return common_response(data='', err=500, msg=json.dumps(err))
    if tags != "":
        tags = tags.split(',')
    else:
        tags = []
    _id = get_mongo_index('cases')
    d = {
        "_id": _id,
        "pd": product_id,
        "md": module_id,
        "name": name,
        "type": type_,
        "p": priority,
        "tags": tags,
        "step": step,
        "expect": expect_,
        "author": current_user.username,
        "st": _id,
        "stat": "待审核",
        "is_del": 0,
        "create_time": time.time(),
        "update_time": time.time()
    }
    try:
        res = cs.table.insert_one(d)
        return common_response(data={"_id": res.inserted_id, "name": name}, err=0, msg="添加成功")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg=e)


@case.route('/quick/save', methods=['PUT'])
@login_required
def quick_save():
    r = request.form
    _id = r.get('_id', '')
    step_ = r.get('step', '')
    expect_ = r.get('expect', '')
    err = {}
    if _id.strip() == "":
        err['_id'] = "_id 不能为空！"
    if step_.strip() == "":
        err['step'] = "step 不能为空！"
    if expect_.strip() == "":
        err['expect'] = "expect 不能为空！"
    if len(err) > 0:
        return common_response(data='', err=500, msg=json.dumps(err))
    try:
        query = {
            "_id": int(_id)
        }
        update = {
            "$set": {
                "step": step_,
                "expect": expect_
            }
        }
        cs = Case()
        cs.table.update_one(query, update)
        return common_response(data='', err=0, msg="快速保存成功！")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg=e)


@case.route('/edit', methods=['GET', 'PUT'])
@login_required
def edit_one():
    cs = Case()
    if request.method == "GET":
        r = request.args
        _id = r.get('_id', '')
        if _id.strip() == "":
            flash("_id 参数不能为空！")
            return redirect(request.referrer)

        case_ = cs.table.find_one({"_id": int(_id)})
        if case_ is None:
            flash("case 不存在！")
            return redirect(request.referrer)

        return render_template('case/edit.one.html', cs=case_, ref=request.referrer)

    if request.method == "PUT":
        r = request.form
        cs = Case()
        _id = r.get('_id', "")
        name = r.get('name', "")
        type_ = r.get('type', "")
        priority = r.get('p', '')
        tags = r.get('tags', "").strip()
        step = r.get('step', "")
        expect_ = r.get('expect', "")
        err = {}
        if _id.strip() == "":
            err['_id'] = "_id 参数不能为空！"
        if name.strip() == "":
            err['name'] = "用例名称: name 不能为空！"
        if type_.strip() == "":
            err['type'] = "用例类型type不能为空！"
        if step.strip() == "":
            err['step'] = "测试步骤不能为空!"
        if expect_.strip() == "":
            err['expect'] = "预期结果：expect 不能为空！"
        if len(err) > 0:
            return common_response(data='', err=500, msg=json.dumps(err))
        if tags != "":
            tags = tags.split(',')
        else:
            tags = []
        q = {
            "_id": int(_id)
        }
        d = {
            "$set": {
                "name": name,
                "type": type_,
                "p": priority,
                "tags": tags,
                "step": step,
                "expect": expect_,
                "update_time": time.time()
            }
        }
        try:
            cs.table.update_one(q, d)
            return common_response(data="", err=0, msg="更新成功")
        except Exception as e:
            app.logger.error(str(e))
            return common_response(data='', err=500, msg="更新失败！")


@case.route('/batch', methods=['POST'])
def batch():
    r = request.form
    cs = Case()
    pd = Product()
    pm = ProductModule()
    try:
        product_id = r.get('product_id', 0)
        product = pd.table.find_one({"_id": int(product_id)})
        if product is None:
            return common_response(data='', err=500, msg="产品ID不存在!")
        file = request.files['file']
        f = file.read()
        data = xlrd.open_workbook(file_contents=f)
        sheet = data.sheets()[0]
        rows = sheet.nrows
        mid = "0"
        for i in range(1, rows):
            parent = sheet.cell(i, 0).value.strip()
            child = sheet.cell(i, 1).value.strip()
            leaf = sheet.cell(i, 2).value.strip()
            if parent == "" and child == "" and leaf == "":
                continue
            if parent != "":
                nt = "parent"
                if child == "" and leaf == "":
                    nt = "leaf"
                    pid = pm.query_or_add(product_id, parent, "0", nt)
                    mid = pid
                else:
                    pid = pm.query_or_add(product_id, parent, "0", nt)
                    if leaf == "":
                        nt = "leaf"
                        cid = pm.query_or_add(product_id, child, pid, nt)
                        mid = cid
                    else:
                        if child != "":
                            nt = "child"
                            cid = pm.query_or_add(product_id, child, pid, nt)
                        else:
                            cid = pid
                        mid = pm.query_or_add(product_id, leaf, cid, "leaf")
            else:
                if leaf == "":
                    nt = "leaf"
                    cid = pm.query_or_add(product_id, child, "0", nt)
                    mid = cid
                else:
                    if child != "":
                        nt = "child"
                        cid = pm.query_or_add(product_id, child, "0", nt)
                    else:
                        cid = pid
                    mid = pm.query_or_add(product_id, leaf, cid, "leaf")
            name = sheet.cell(i, 3).value.strip()
            if name == "":
                continue
            step = sheet.cell(i, 4).value.strip()
            expt = sheet.cell(i, 5).value.strip()
            priority = sheet.cell(i, 6).value.strip()
            if priority == "":
                priority = "P1"
            tp = sheet.cell(i, 7).value.strip()
            if tp == "":
                tp = "功能"
            tags = sheet.cell(i, 8).value.strip().split(";")
            _id = get_mongo_index('cases')
            d = {
                "_id": _id,
                "pd": product_id,
                "md": mid,
                "name": name,
                "type": "功能",
                "p": priority,
                "tags": tags,
                "step": step,
                "expect": expt,
                "author": current_user.username,
                "st": _id,
                "stat": "待审核",
                "is_del": 0,
                "create_time": time.time(),
                "update_time": time.time()
            }
            cs.table.insert_one(d)
        return common_response(data='', err='', msg='导入完成！')
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg=str(e))
