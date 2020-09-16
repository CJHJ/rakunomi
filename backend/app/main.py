from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .forms import FeedbackForm
from app.models import MU_Relationship
from . import app


@app.route('/api/feedback', methods='POST')
@jwt_required
def feedback():
    form = FeedbackForm(request.form)
    if form.validate():
        relationship = MU_Relationship.query.filter_by(meeting_id=form.meeting_id.data, user_id=get_jwt_identity()).first()
        relationship.review = form.review.data
        ret = {
            "msg": "success",
        }
        return jsonify(ret), 200
    return jsonify({"msg": form.errors}), 401
