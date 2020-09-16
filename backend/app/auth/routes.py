from ..auth import bp
from .. import db
from .. import blacklist
from flask import jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_raw_jwt
from .forms import LoginForm, RegistrationForm
from ..models import Users


@bp.route('/sign_in', methods=['POST'])
def login():
    """
    Login function
    :return:
    {
        "msg": "Success"
        "token": "sdfdfasdfadsf"
    }
    """
    form = LoginForm(request.form)
    if form.validate():
        user = Users.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            return jsonify({"msg": "Bad username or password",
                            'token': ""}), 401
        ret = {
            'mgs': 'Success',
            'token': create_access_token(identity=form.username.data)
        }
        return jsonify(ret), 200
    return jsonify({"msg": form.errors, 'token': ""}), 401


@bp.route('/sign_up', methods=['POST'])
def register():
    """
    register function
    :return:
    {
        "msg": "Success"
        "token": "sdfdfasdfadsf"
    }
    """
    form = RegistrationForm(request.form)
    if form.validate():
        user = Users(username=form.username.data, email=form.email.data,
                     rakuten_id=form.rakuten_id.data, zoom_id=form.zoom_id.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        ret = {
            "msg": "Sign up successed",
            'token': create_access_token(identity=form.username.data)
        }
        return jsonify(ret), 200
    return jsonify({"msg": form.errors, 'token': ""}), 401


@bp.route('/sign_out', methods=['GET'])
@jwt_required
def logout():
    """
       register function
       :return:
       {
           "msg": "Success"
       }
       """
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"msg": "Success"}), 200

