from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .forms import FeedbackForm
from app.models import MU_Relationship, Meetings, Items
from . import app, db


@app.route('/api/feedback', methods=['POST'])
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


@app.route('/api/wishlist', methods=['GET'])
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
            'item_id': it.id,
            'product_id': it.product_id,
            'amount': it.amount,
            'total_price': it.price
        } for it in items]
    }
    return jsonify(ret), 200


@app.route('/api/wishlist', methods=['POST'])
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


@app.route('/api/wishlist', methods=['PUT'])
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


@app.route('/api/wishlist', methods=['DELETE'])
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
