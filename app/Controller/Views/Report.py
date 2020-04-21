from app.Models.RunModel import Run
from app.Models.PlanModel import Plan
from flask_login import login_required
from app.Models.ProductModel import Product, ProductModule
from flask import Blueprint, request, redirect, render_template, flash


report = Blueprint('report', __name__)


@report.route('/detail', methods=['GET'])
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
    data = rc.table.find_one({"_id": int(run_id)})
    product_id = data['pd']
    plan_id = data['pl']
    product_ = pd.table.find_one({"_id": int(product_id)})
    plan_ = pl.table.find_one({"_id": int(plan_id)})
    case_ids = data['ids']
    modules = pm.get_run_tree({"pd": str(product_id)}, case_ids)
    progress = []
    p = data['progress']
    progress.append(p['stop']['count'])
    progress.append(p['abort']['count'])
    progress.append(p['fail']['count'])
    progress.append(p['pass']['count'])
    progress.append(p['init']['count'])
    pct = []
    pct.append(float("%.2f" % (p['init']['count']/p['total']['count']))*100)
    pct.append(float("%.2f" % (p['pass']['count']/p['total']['count']))*100)
    pct.append(float("%.2f" % (p['fail']['count']/p['total']['count']))*100)
    pct.append(float("%.2f" % (p['abort']['count']/p['total']['count']))*100)
    pct.append(float("%.2f" % (p['stop']['count']/p['total']['count']))*100)
    return render_template('report/report.detail.html', product=product_, plan=plan_, modules=modules, run=data, progress=progress, pct=pct)
