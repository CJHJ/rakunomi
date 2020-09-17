from . import bp
from .forms import FeedbackForm
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Users, Meetings, MU_Relationship, Items
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
    print(meeting_info)
    if not meeting_info:
        return jsonify({"msg": "Invalid request"}), 401
    new_datetime = datetime.strptime(
        meeting_info['datetime'], '%Y-%m-%d %H:%M')
    meeting = Meetings(name=meeting_info['meeting_name'],
                       datetime=new_datetime,
                       leader_id=get_jwt_identity())
    db.session.add(meeting)
    db.session.flush()
    meeting.set_invited_users(meeting_info['invited_users_id'])
    db.session.commit()
    return jsonify({"msg": "Success", "meeting_id": meeting.id}), 200


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


@bp.route('/wishlist', methods=['GET'])
@jwt_required
def get_wishlist():
    meeting_id = request.args.get('meeting_id', type=int)
    meeting = Meetings.query.get(meeting_id)
    if not meeting:
        return jsonify({"msg": "Failed to find this meeting", "data": ""}), 401
    items = meeting.get_wishlist_items.all()
    ret = {
        'msg':
            'Success',
        'data': [{
            'item id': it.id,
            'product id': it.product_id,
            'amount': it.amount,
            'total price': it.price
        } for it in items]
    }
    return jsonify(ret), 200


@bp.route('/wishlist', methods=['POST'])
@jwt_required
def create_wishlist():
    """
    Post wishlist items
    Inputs:
    -------
    {
        "meeting_id": 12,
        "data": [
                {"product_id": 1,
                "amount": 2,
                "total_price": 200}]
    }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"msg": "Invalid request"}), 401
    meeting = Meetings.query.get(data["meeting_id"])
    if not meeting:
        return jsonify({"msg": "Failed to find this meeting"}), 401
    for it in data["data"]:
        item = Items(meeting_id=data["meeting_id"],
                     product_id=it["product_id"],
                     amount=it["amount"],
                     price=it["total_price"])
        db.session.add(item)
    db.session.commit()
    return jsonify({"msg": "Success"}), 200


@bp.route('/wishlist', methods=['PUT'])
@jwt_required
def update_wishlist():
    """
    Update a wishlist item
    Inputs:
    -------
    {
        "item_id": 1,
        "product_id": 12,
        "amount": 2,
        "total_price": 200}
    }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"msg": "Invalid request"}), 401
    item = Items.query.get(data["item_id"])
    if not item:
        return jsonify({"msg": "Failed to find this item"}), 401
    item.product_id = data["product_id"]
    item.amount = data["amount"]
    item.price = data["total_price"]
    return jsonify({'msg': 'Success'}), 200


@bp.route('/wishlist', methods=['DELETE'])
@jwt_required
def delete_wishlist_item():
    item_id = request.args.get('item_id', type=str)
    item = Items.query.get(item_id)
    if not item:
        return jsonify({"msg": "Failed to find this item"}), 401
    relationship = MU_Relationship.query.filter_by(
        meeting_id=item.meeting_id, user_id=get_jwt_identity()).first()
    if not relationship:
        return jsonify({"msg": "Only allowed to delete item in your meeting"
                        }), 401
    db.session.delete(item)
    db.session.commit()
    return jsonify({'msg': 'Success'}), 200


@bp.route('/feedback', methods=['POST'])
@jwt_required
def create_feedback():
    form = FeedbackForm(request.form)
    if form.validate():
        relationship = MU_Relationship.query.filter_by(
            meeting_id=form.meeting_id.data,
            user_id=get_jwt_identity()).first()
        if not relationship:
            return jsonify(
                {"msg": "Only allowed to give feedback to your meeting"}), 401
        relationship.review = form.review.data
        return jsonify({"msg": "Success"}), 200
    return jsonify({"msg": form.errors}), 401


@bp.route('/feedback_list', methods=['GET'])
@jwt_required
def get_feedbacks():
    """
    Return all feedbacks for a meeting
    Returns
    -------
    {
        "msg": "Success",
        "data": [
                {"feedback_msg": "Very nice nomikai"}]
    }
    """
    meeting_id = request.args.get('meeting_id', type=str)
    relationships = MU_Relationship.query.filter_by(
        meeting_id=meeting_id).all()
    ret = {
        'msg':
            'Success',
        'data': [{'feedback_msg': re.review} for re in relationships]
    }
    return jsonify(ret), 200
