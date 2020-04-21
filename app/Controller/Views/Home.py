from app.Models.RunModel import Run
from app.Models.CaseModel import Case
from flask_login import login_required
from app.Models.UserModel import UserInfo
from app.Models.ProductModel import Product
from flask import Blueprint, render_template


home = Blueprint('home', __name__)


@home.route('/ok', methods=['GET', 'POST'])
def ok():
        return 'ok'


@home.route('/', methods=['GET'])
@login_required
def dashboard():
        user_info = UserInfo()
        user_num = user_info.count_user()
        pd = Product()
        product_num = pd.table.find().count()
        cs = Case()
        case_num = cs.table.find().count()
        rc = Run()
        run_num = rc.table.find().count()
        top = cs.get_top_user()
        case_statistic = cs.get_case_statistic()
        d = {
                "total_user": user_num,
                "total_product": product_num,
                "total_case": case_num,
                "total_run": run_num,
                "top": top,
                "case_statistic": case_statistic
        }
        return render_template('home/dashboard.html', d=d)
