from ..auth import bp
from .. import db
from .. import blacklist
from flask import jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_raw_jwt
# from ..models import Users


@bp.route('/sign_in', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if username != 'test' or password != 'test':
        return jsonify({"msg": "Bad username or password"}), 401
    ret = {
        'access_token': create_access_token(identity=username)
    }
    return jsonify(ret), 200


@bp.route('/sign_up', methods=['GET'])
def register():
    # user = Users(username=request.form['username'],
    #             email=request.form['email'])
    # db.session.add(user)
    # db.session.commit()
    ret = {
        "msg": "Successful registered"
    }
    return jsonify(ret), 200



@bp.route('/sign_out', methods=['GET'])
@jwt_required
def logout():
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200