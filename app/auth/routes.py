from ..auth import bp
from .. import blacklist
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity,create_access_token, get_raw_jwt


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
    return 200


@bp.route('/sign_out', methods=['GET'])
@jwt_required
def logout():
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200