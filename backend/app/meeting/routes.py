from . import bp
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Users, Meetings
from datetime import datetime


@bp.route('/meetings', methods=['GET'])
@jwt_required
def get_confirmed_list():
    user_id = request.args.get('user_id', type=int)
    cur_user = Users.query.get(user_id)
    if not cur_user:
        return jsonify({"msg": "Failed to find this user", "data": ""}), 401
    meetings = cur_user.get_confirmed_meetings().all()
    ret = {
        'msg':
            'Success',
        'data': [{
            'meeting_id': me.id,
            'meeting_name': me.name,
            'leader_username': me.get_leader_name(),
            'datetime': me.datetime
        } for me in meetings]
    }
    return jsonify(ret), 200


@bp.route('/meetings/invited', methods=['GET'])
@jwt_required
def get_invited_list():
    user_id = request.args.get('user_id', type=int)
    cur_user = Users.query.get(user_id)
    if not cur_user:
        return jsonify({"msg": "Failed to find this user", "data": ""}), 401
    meetings = cur_user.get_invited_meetings().all()
    ret = {
        'msg':
            'Success',
        'data': [{
            'meeting_id': me.id,
            'meeting_name': me.name,
            'leader_username': me.get_leader_name(),
            'datetime': me.datetime
        } for me in meetings]
    }
    return jsonify(ret), 200


@bp.route('/meetings/past', methods=['GET'])
@jwt_required
def get_past_list():
    user_id = request.args.get('user_id', type=int)
    cur_user = Users.query.get(user_id)
    if not cur_user:
        return jsonify({"msg": "Failed to find this user", "data": ""}), 401
    meetings = cur_user.get_past_meetings().all()
    ret = {
        'msg':
            'Success',
        'data': [{
            'meeting_id': me.id,
            'meeting_name': me.name,
            'leader_username': me.get_leader_name(),
            'datetime': me.datetime
        } for me in meetings]
    }
    return jsonify(ret), 200

# remove leader and datetime info for privacy
@bp.route('/meetings/all_past', methods=['GET'])
@jwt_required
def get_allpast_list():
    meetings = Meetings.query.filter(Meetings.datetime < datetime.utcnow())\
            .order_by(Meetings.datetime.desc()).all()
    ret = {
        'msg':
            'Success',
        'data': [{
            'meeting_id': me.id,
            'meeting_name': me.name
        } for me in meetings]
    }
    return jsonify(ret), 200


@bp.route('/meeting', methods=['GET'])
@jwt_required
def get_meeting():
    meeting_id = request.args.get('meeting_id', type=str)
    user_id = get_jwt_identity()
    meeting = Meetings.query.get(meeting_id)
    if not meeting:
        return jsonify({"msg": "Failed to find this meeting", "data": ""}), 401
    ret = {
        'msg':
            'Success',
        'data': {
            'meeting_name': meeting.name,
            'leader_username': meeting.get_leader_name(),
            'datetime': meeting.datetime,
            'invited_username': [],
            'confirmed_username': []
        }
    }
    return jsonify(ret), 200
