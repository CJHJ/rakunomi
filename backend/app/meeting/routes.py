from . import bp
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Users, Meetings, MU_Relationship
from datetime import datetime
from .. import db


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
    invited_username = []
    if meeting.leader_id == user_id:
        invited_username = [
            user.username for user in meeting.get_invited_users()
        ]
    ret = {
        'msg': 'Success',
        'data': {
            'meeting_name':
                meeting.name,
            'leader_username':
                meeting.get_leader_name(),
            'datetime':
                meeting.datetime,
            'invited_username':
                invited_username,
            'confirmed_username': [
                user.username for user in meeting.get_confirmed_users()
            ]
        }
    }
    return jsonify(ret), 200


# only allow leader to change meeting info
@bp.route('/meeting', methods=['POST'])
@jwt_required
def create_meeting():
    """
    Let leader create a new meeting
    Inputs:
    -------
    {
        "meeting_name": "Rakunomi",
        "datetime": "2020-09-17 12:03",
        "invited_users_id": [1,3,4]}
    }
    """
    meeting_info = request.get_json(silent=True)
    if not meeting_info:
        return jsonify({"msg": "Invalid request"}), 401
    new_datetime = datetime.strptime(meeting_info['datetime'], '%Y-%m-%d %H:%M')
    meeting = Meetings(meeting_name=meeting_info['meeting_name'],
                       datetime=new_datetime,
                       leader_id=get_jwt_identity())
    meeting.set_invited_users(meeting_info['invited_users_id'])
    db.session.add(meeting)
    db.session.commit()
    return jsonify({"msg": "Success"}), 200


# only allow leader to change meeting info
@bp.route('/meeting', methods=['PUT'])
@jwt_required
def update_meeting():
    """
    Let leader modify the meeting info
    Inputs:
    -------
    {
        "meeting_id": 12,
        "data": {"meeting_name": "Rakunomi",
                "datetime": "2020-09-17 12:03",
                "invited_users_id": [1,3,4]}
    }
    """
    data = request.get_json(silent=True)
    user_id = get_jwt_identity()
    meeting = Meetings.query.get(data['meeting_id'])
    if not meeting:
        return jsonify({"msg": "Failed to find this meeting", "data": ""}), 401
    meeting_info = data['data']
    if meeting.leader_id == user_id:
        meeting.meeting_name = meeting_info['meeting_name']
        new_datetime = datetime.strptime(meeting_info['datetime'],
                                         '%Y-%m-%d %H:%M')
        meeting.datetime = new_datetime
        meeting.set_invited_users(meeting_info['invited_users_id'])
    return jsonify({"msg": "Success"}), 200


@bp.route('/confirm', methods=['GET'])
@jwt_required
def confirm_meeting():
    meeting_id = request.args.get('meeting_id', type=str)
    relationship = MU_Relationship.query.filter_by(
        meeting_id=meeting_id, user_id=get_jwt_identity()).first()
    if not relationship:
        return jsonify({"msg": "Failed to confirm your meeting"}), 401
    relationship.approved = True
    return jsonify({"msg": "Success"}), 200
