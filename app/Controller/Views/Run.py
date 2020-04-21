import time
from app import app
from app.Models.RunModel import Run
from app.Models.PlanModel import Plan
from flask_login import login_required
from app.Models.ProductModel import Product, ProductModule
from app.Common.Utils import get_query_url, common_response, get_mongo_index
from flask import Blueprint, request, redirect, url_for, render_template, flash


run = Blueprint('run', __name__)


@run.route('/list', methods=['GET'])
@login_required
def lists():
    r = request.args
    pd = Product()
    pl = Plan()
    rc = Run()
    page = r.get('page', 1)
    size = r.get('size', 16)
    if page is None:
        page = 1
    if size is None:
        size = 16
    product_id = r.get('product_id', '')
    plan_id = r.get('plan_id', '')
    if product_id.strip() == "":
        flash("产品 product_id 不能为空!")
        return redirect(url_for('plan.product'))
    if plan_id.strip() == "":
        flash("plan_id 不能为空！")
        return redirect(url_for('plan.lists', product_id=product_id))
    prod = pd.table.find_one({"_id": int(product_id)})
    cur_plan = pl.table.find_one({"_id": int(plan_id)})
    if prod is None:
        flash("产品不存在，请重新选择!")
        return redirect(url_for('plan.product'))
    if cur_plan is None:
        flash("计划不存在，请重新选择计划!")
        return redirect(url_for('plan.lists', product_id=product_id))
    search = r.get('search', None)
    if search is None:
        search = {
            "pl": plan_id
        }
    else:
        search = {
            "pl": plan_id,
            "name": {
                "$regex": search
            }
        }
    runs = rc.get_list(search, int(page), int(size))
    params = get_query_url(request)
    return render_template('run/run.list.html', product=prod, plan=cur_plan, runs=runs, url=request.path, params=params)


@run.route('/add', methods=['GET', 'POST'])
@login_required
def add():
    if request.method == "GET":
        r = request.args
        product_id = r.get('product_id', '')
        plan_id = r.get('plan_id', '')
        if product_id.strip() == '':
            flash("产品ID不存在！")
            return redirect(url_for('plan.product'))
        if plan_id.strip() == "":
            flash("计划不存在，请重新选择！")
            return redirect(request.referrer)
        pd = Product()
        pl = Plan()
        product = pd.table.find_one({"_id": int(product_id)})
        plan_ = pl.table.find_one({"_id": int(plan_id)})
        if product is None:
                return redirect(url_for('case.dashboard'))
        pm = ProductModule()
        modules = pm.get_module_tree({"pd": str(product_id)}, 'all')
        return render_template('run/run.add.html', product=product, modules=modules, plan=plan_)

    if request.method == "POST":
        r = request.form
        rc = Run()
        product_id = r.get("product_id", "")
        plan_id = r.get("plan_id", "")
        run_name = r.get('run_name', '')
        assign_to = r.get('assign_to', '')
        cid = r.get('cid', '')
        err = {}
        if product_id.strip() == "":
            err['product_id'] = "产品ID 不能为空!"
        if plan_id.strip() == "":
            err['plan_id'] = "计划ID 不能为空！"
        if run_name.strip() == "":
            err["run_name"] = "执行名称不能为空!"
        if assign_to.strip() == "":
            err['assign_to'] = "用例执行者不能为空!"
        if cid.strip() == "":
            err['cit'] = "选择用例为空，请先选择用例!"
        if len(err) > 0:
            return common_response(data=err, err=500, msg="参数错误，请查看接口返回!")
        cases = cid.split(',')
        ids = list(map(int, cases))
        detail = {}
        for case in cases:
            detail[case] = {
                "stat": "init",
                "comment": "",
                "bugs": "",
                "update_time": ""
            }
        case_count = len(cases)
        progress = {
            "init": {
                "name": "待执行",
                "count": case_count
            },
            "stop": {
                "name": "暂停",
                "count": 0
            },
            "abort": {
                "name": "废弃",
                "count": 0
            },
            "fail": {
                "name": "失败",
                "count": 0
            },
            "pass": {
                "name": "通过",
                "count": 0
            },
            "total": {
                "name": "总数",
                "count": case_count
            },
            "percent": {
                "name": "百分比",
                "count": "0%"
            }
        }
        d = {
            "_id": get_mongo_index('run_index'),
            "pd": product_id,
            "pl": plan_id,
            "name": run_name,
            "assign": assign_to,
            "stat": "未开始",
            "progress": progress,
            "start_time": "",
            "end_time": "",
            "ids": ids,
            "detail": detail
        }
        try:
            data = rc.table.insert_one(d)
            return common_response(data={"_id": data.inserted_id}, err=0, msg="添加执行成功!")
        except Exception as e:
            app.logger.error(str(e))
            return common_response(data='', err=500, msg=str(e))


@run.route('/del/<run_id>',  methods=['DELETE'])
@login_required
def delete(run_id):
    rc = Run()
    try:
        result = rc.table.delete_one({"_id": int(run_id)})
        return common_response(data=result.raw_result, err=0, msg='删除成功！')
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg='删除job失败！')


@run.route('/detail', methods=['GET'])
@login_required
def detail():
    r = request.args
    pd = Product()
    pm = ProductModule()
    pl = Plan()
    rc = Run()
    run_id = r.get('run_id', '')
    if run_id.strip() == "":
        flash("run_id 不能为空！", "err")
        return redirect(request.referrer)
    rc.table.update_one({"_id": int(run_id)}, {"$set": {"stat": "执行中", "start_time": time.time()}})
    data = rc.table.find_one({"_id": int(run_id)})
    product_id = data['pd']
    plan_id = data['pl']
    product_ = pd.table.find_one({"_id": int(product_id)})
    plan_ = pl.table.find_one({"_id": int(plan_id)})
    case_ids = data['ids']
    modules = pm.get_run_tree({"pd": str(product_id)}, case_ids)
    return render_template('run/run.detail.html', product=product_, modules=modules, plan=plan_, run=data)


@run.route('/case/stat', methods=['PUT'])
def update_run_case():
    r = request.form
    rc = Run()
    run_id = r.get('run_id', '')
    case_id = r.get('case_id', '')
    old_stat = r.get('old_stat', '').strip()
    new_stat = r.get('new_stat', '').strip()
    if run_id.strip() == "":
        return common_response(data='', err=500, msg="run_id 不能为空！")
    if case_id.strip() == "":
        return common_response(data='', err=500, msg="case_id 不能为空！")
    if old_stat == "":
        return common_response(data='', err=500, msg="old_stat 不能为空！")
    if new_stat == "":
        return common_response(data='', err=500, msg="new_stat 不能为空！")
    try:
        q = {"_id": int(run_id)}
        u = {
            "$inc": {
                "progress."+old_stat+".count": -1,
                "progress."+new_stat+".count": 1
            },
            "$set": {
                "detail."+case_id+".stat": new_stat
            }
        }
        res = rc.table.update_one(q, u)
        return common_response(data=res.raw_result, err=0, msg="更新case状态成功！")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg="更新case状态失败")


@run.route('/case/info', methods=['PUT'])
@login_required
def update_run_case_info():
    r = request.form
    rc = Run()
    run_id = r.get('run_id', '').strip()
    case_id = r.get('case_id', '').strip()
    bug = r.get('bug', '')
    comment = r.get('comment', '')
    if run_id.strip() == "":
        return common_response(data='', err=500, msg="run_id 不能为空!")
    if case_id == "":
        return common_response(data='', err=500, msg="case_id 不能为空!")
    try:
        q = {"_id": int(run_id)}
        d = {
            "$set": {
                "detail."+case_id+".bugs": bug,
                "detail."+case_id+".comment": comment
            }
        }
        res = rc.table.update_one(q, d)
        return common_response(data=res.raw_result, err=0, msg="更新成功！")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg="更新失败，请重试!")


@run.route('/stat', methods=['PUT'])
@login_required
def update_run_stat():
    r = request.form
    rc = Run()
    run_id = r.get('run_id', '').strip()
    stat = r.get('stat', '').strip()
    if run_id == "":
        return common_response(data='', err=500, msg='run_id 不能为空!')
    if stat not in ['未开始', '执行中', '已完成']:
        return common_response(data='', err=500, msg='状态不合法!')
    try:
        data = rc.table.update_one({"_id": int(run_id)}, {"$set": {"stat": stat, "end_time": time.time()}})
        return common_response(data=data.raw_result, err=0, msg="更新状态成功！")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg="更新状态失败!")
