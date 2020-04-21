from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Length, Email, EqualTo


class UserLoginForm(FlaskForm):
    username = StringField('用户名', validators=[DataRequired("请输入用户名!")])
    password = PasswordField('密 码', validators=[DataRequired("请输入密码！"), Length(6, 20, message="用户密码长度不合法")])


class UserRegisterForm(FlaskForm):
    username = StringField('用户名', validators=[DataRequired("请输入用户名!"), Length(6, 20, message="用户名长度不合法")])
    email = StringField('邮 箱', validators=[DataRequired("请输入用户邮箱!"), Email(message="邮箱地址不合法！")])
    password = PasswordField('密 码', validators=[DataRequired("请输入密码！"), Length(6, 20, message="用户密码长度不合法"), EqualTo('confirm', message="密码不一致，请重新输入！")])
    confirm = PasswordField('确认密码', validators=[DataRequired("请重复密码！"), Length(6, 20, message="用户密码长度不合法")])
