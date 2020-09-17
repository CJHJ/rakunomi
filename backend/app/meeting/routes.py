from . import bp
from flask import jsonify, request, current_app as app
from flask_jwt_extended import jwt_required
from ..models import Users, Meetings
from datetime import datetime


@bp.route('/meetings', methods=['GET'])
@jwt_required
def get_confirmed_list():
    page = request.args.get('page', 1, type=int)
    user_id = request.args.get('user_id', type=int)
    cur_user = Users.query.get(user_id)
    if not cur_user:
        return jsonify({"msg": "Failed to find this user", "data": ""}), 401
    meetings = cur_user.confirmed_meetings().paginate(page, app.config['PER_PAGE'], False)
    ret = {'msg': 'Success',
           'data': [{'meeting_id': me.id,
                     'meeting_name': me.name,
                     'leader_user_id': me.leader_id,
                     'Datetime': me.datetime} for me in meetings.iter_pages()]}
    return jsonify(ret), 200


@bp.route('/meetings/invited', methods=['GET'])
@jwt_required
def get_invited_list():
    page = request.args.get('page', 1, type=int)
    user_id = request.args.get('user_id', type=int)
    cur_user = Users.query.get(user_id)
    if not cur_user:
        return jsonify({"msg": "Failed to find this user", "data": ""}), 401
    meetings = cur_user.invited_meetings().paginate(page, app.config['PER_PAGE'], False)
    ret = {'msg': 'Success',
           'data': [{'meeting_id': me.id,
                     'meeting_name': me.name,
                     'leader_user_id': me.leader_id,
                     'Datetime': me.datetime} for me in meetings.iter_pages()]}
    return jsonify(ret), 200



@bp.route('/meetings/past', methods=['GET'])
@jwt_required
def get_past_list():
    page = request.args.get('page', 1, type=int)
    user_id = request.args.get('user_id', type=int)
    cur_user = Users.query.get(user_id)
    if not cur_user:
        return jsonify({"msg": "Failed to find this user", "data": ""}), 401
    meetings = cur_user.past_meetings().paginate(page, app.config['PER_PAGE'], False)
    ret = {'msg': 'Success',
           'data': [{'meeting_id': me.id,
                     'meeting_name': me.name,
                     'leader_user_id': me.leader_id,
                     'Datetime': me.datetime} for me in meetings.iter_pages()]}
    return jsonify(ret), 200


@bp.route('/meetings/all_past', methods=['GET'])
@jwt_required
def get_allpast_list():
    page = request.args.get('page', 1, type=int)
    meetings = Meetings.query.filter(Meetings.datetime < datetime.utcnow())\
            .order_by(Meetings.datetime.desc()).paginate(page, app.config['PER_PAGE'], False)
    ret = {'msg': 'Success',
           'data': [{'meeting_id': me.id,
                     'meeting_name': me.name,
                     'leader_user_id': me.leader_id,
                     'Datetime': me.datetime} for me in meetings.iter_pages()]}
    return jsonify(ret), 200