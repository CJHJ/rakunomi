from ..auth import bp
from .. import db
from .. import blacklist
from flask import jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_raw_jwt, get_jwt_identity
from .forms import LoginForm, RegistrationForm
from ..models import Users
import datetime


@bp.route('/sign_in', methods=['POST'])
def login():
    """
    Login function
    :return:
    {
        "msg": "Success",
        "data": {
            "token": "sdfdfasdfadsf",
            "user_id": 1,
            "user_name": "Rakuten Taro"
        }
    }
    """
    form = LoginForm(request.form)
    if form.validate():
        user = Users.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            return jsonify({
                "msg": "Bad username or password",
                'data': ""
            }), 401
        expires = datetime.timedelta(days=7)
        ret = {
            'mgs': 'Success',
            'data': {
                'token': create_access_token(identity=user.id, expires_delta=expires),
                'user_id': user.id,
                'user_name': user.username
            }
        }
        return jsonify(ret), 200
    return jsonify({"msg": form.errors, 'data': ""}), 401


@bp.route('/sign_up', methods=['POST'])
def register():
    """
    register function
    :return:
    {
        "msg": "Success",
        "data":{
            "token": "dafdfadsf"
        }
    }
    """
    form = RegistrationForm(request.form)
    if form.validate():
        user = Users(
            username=form.username.data,
            email=form.email.data,
            rakuten_id=form.rakuten_id.data,
            zoom_id=form.zoom_id.data,
        )
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        ret = {'msg': 'Sign up succeed!',
               'data':{
                    'token': create_access_token(identity=user.id),
                    'user_id': user.id,
                    'user_name': user.username
               }}
        return jsonify(ret), 200
    return jsonify({"msg": form.errors}), 401


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


@bp.route('/search/user', methods=['GET'])
@jwt_required
def search_user():
    """
    Search user by its user name
    Returns
    -------

    """
    username = request.args.get('username', type=str)
    user = Users.query.filter_by(username=username).first()
    if user is None:
        return jsonify({"msg": "Can't find this user"}), 401
    return jsonify({"msg": "Find this user!"}), 200


@bp.route('/user/<username>', methods=['GET'])
@jwt_required
def get_user(username):
    user = Users.query.filter_by(username=username).first()
    if user is None:
        return jsonify({"msg": "User doesn't exit", "data": ""}), 401
    ret = {
        'mgs': "Success",
        'data': {
            'username': user.username,
            'email': user.email,
            'rakuten_id': user.rakuten_id,
            'zoom_id': user.zoom_id,
            'allergies': user.allergies
        }
    }
    return jsonify(ret), 200


@bp.route('/user/<username>', methods=['DELETE'])
@jwt_required
def delete_user(username):
    user = Users.query.filter_by(username=username).first()
    if user is None or user.id != get_jwt_identity():
        return jsonify({"msg": "Failed to delete this user"}), 401
    db.session.delete(user)
    db.session.commit()
    ret = {"msg": "Delete succeed!"}
    return jsonify(ret), 200


@bp.route('/user/<username>', methods=['PUT'])
@jwt_required
def update_user(username):
    form = RegistrationForm(request.form)
    if form.validate():
        user = Users.query.filter_by(username=username).first()
        if user.id != get_jwt_identity():
            return jsonify({"msg": "Failed to update this user info"}), 401
        user.username = form.username.data
        user.email = form.email.data
        user.rakuten_id = form.rakuten_id.data
        user.zoom_id = form.zoom_id.data
        user.set_password(form.password.data)
        ret = {"msg": "Update succeed!"}
        return jsonify(ret), 200
    return jsonify({"msg": form.errors}), 401
