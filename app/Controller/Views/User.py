import time
from app.Common.Utils import *
from app.Models.UserModel import User, UserInfo
from app.Forms.UserForm import UserLoginForm, UserRegisterForm
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from flask import Blueprint, request, redirect, url_for, Response, render_template, flash


user = Blueprint('user', __name__)


@user.route('/login', methods=['GET', 'POST'])
def login():
    form = UserLoginForm()
    if request.referrer:
        next_url = get_next(request.referrer)
    else:
        next_url = ''
    if request.method == "GET":
        return render_template('user/login.html', form=form)
    if request.method == "POST":
        u = UserInfo()
        r = request.form
        username = r.get('username', None)
        password = r.get('password', None)
        if username and password:
            q = {
                "username": {
                    "$regex": username,
                    "$options": "$i"
                }
            }
            user_info = u.get_user(q)
            if user_info and check_password_hash(user_info.get('password', ''), password):
                curr_user = User(username)
                curr_user.id = username
                login_user(curr_user)
                return redirect("{}{}".format(app.config.get('SERVER_URL'), next_url))
            else:
                flash("用户名或密码错误！")
                return render_template('user/login.html', form=form)
        else:
            flash("用户名和密码不能为空！")
            return render_template('user/login.html', form=form)


@user.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('user.login'))


@user.route('/register', methods=['GET', 'POST'])
def register():
    form = UserRegisterForm()
    if request.method == "GET":
        return render_template('user/register.html', form=form)

    if request.method == "POST":
        if form.validate() is False:
            return render_template('user/register.html', form=form)
        else:
            reg = UserInfo()
            check_user = reg.check_user_exists(form.username.data)
            check_email = reg.check_email_exists(form.email.data)
            if check_user:
                flash("{}:用户名已经存在！".format(form.username.data))
            if check_email:
                flash("{}:邮箱已经存在！".format(form.email.data))
            if check_user or check_email:
                return render_template('user/register.html', form=form)
            else:
                d = {
                    "_id": get_mongo_index('users'),
                    "username": form.username.data,
                    "password": generate_password_hash(form.password.data),
                    "info": {"email": form.email.data.lower(),
                             "avator": "/static/images/cropper.jpg"},
                    "create_time": int(time.time())
                }
                res = reg.add_user(d)
                if res is not None:
                    flash("注册成功~")
                    return redirect(url_for('user.login', form=UserLoginForm()))
                else:
                    flash("注册失败,请重试~")
                    return render_template('user/register.html', form=form)


@user.route('/profile/<user_id>', methods=['GET'])
@login_required
def profile(user_id):
    user_info = UserInfo()
    member = user_info.get_user({"_id": int(user_id)})
    if member is None:
        flash("用户不存在!")
        return redirect(url_for('user.members'))
    return render_template('user/profile.html', member=member)


@user.route('/profile/edit', methods=['GET', 'PUT'])
@login_required
def edit_profile():
    if request.method == "GET":
        r = request.args
    if request.method == "PUT":
        r = request.form
    user_id = r.get('user_id')
    u = UserInfo()
    member = u.get_user({"_id": int(user_id)})
    if member is None:
        flash("用户不存在!")
        return redirect(url_for('user.members'))
    if request.method == "GET":
        return render_template('user/profile.edit.html', member=member)

    if request.method == "PUT":
        addr = r.get('addr', '')
        title = r.get('title', '')
        skills = r.get('skills', '').split(',')
        sk = []
        for skill in skills:
            if skill == "":
                continue
            s = skill.split(":")
            d = {
                "sk": s[0],
                "sp": s[1]
            }
            sk.append(d)
        phone = r.get('phone', '').strip()
        favor = r.get('favor', '').strip()
        print(skills)
        intro = r.get('intro', '')
        q = {
            "_id": int(user_id)
        }
        d = {
            "info.addr": addr,
            "info.title": title,
            "info.intro": intro,
            "info.skills": sk
        }
        if phone != "":
            d['info.phone'] = phone
        if favor != "":
            d['info.favor'] = favor
        update = {
            "$set": d
        }
        try:
            u.table.update_one(q, update)
            return common_response(data={"url": url_for("user.profile", user_id=user_id)}, err=0, msg="更新成功!")
        except Exception as e:
            app.logger.error(str(e))
            return common_response(data='', err=500, msg=str(e))


@user.route('members', methods=['GET'])
@login_required
def members():
    r = request.args
    search = r.get('search', '').strip()
    user_info = UserInfo()
    page = r.get('page', 1)
    size = r.get('size', 9)
    field_filter = {'_id': 1, 'username': 1, 'info': 1}
    query = {}
    if search != "":
        query["username"] = {
            "$regex": "{}|{}".format(search, search.lower())
        }
    user_list = user_info.get_list(query, page, size, field_filter)
    params = get_query_url(request)
    return render_template('user/members.html', members=user_list, url=request.path, params=params)


@user.route('avator', methods=['GET', 'POST'])
@login_required
def avator():
    if request.method == "GET":
        return render_template('user/avator.html')

    if request.method == "POST":
        img = request.form.get('img')
        img = urllib.parse.unquote(img)
        user_info = UserInfo()
        try:
            user_info.update_user({"username": current_user.get_id()},
                                  {"$set": {
                                      "info.avator": img
                                  }})
        except Exception as e:
            app.logger.error(str(e))
            return Response(response=format_output(data=None, err=500, msg=e), mimetype="application/json", status=500)
        return Response(response=format_output(data='', err=0, msg='上传头像成功'), mimetype="application/json", status=200)


@user.route('/list', methods=['POST'])
@login_required
def user_list():
    r = request.form
    name = r.get('name', '')
    u = UserInfo()
    query = {
        "username": {
                "$regex": name,
                "$options": "$i"
            }
    }
    try:
        users = u.table.find(query, {"username": 1})
        users = list_mongo_res(users)
        return common_response(data=users, err=0, msg="查询成功！")
    except Exception as e:
        app.logger.error(str(e))
        return common_response(data='', err=500, msg=str(e))
