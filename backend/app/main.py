from ..auth import bp
from .. import db
from .. import blacklist
from flask import jsonify, request, Flask
from flask_jwt_extended import jwt_required, create_access_token, get_raw_jwt, get_jwt_identity
from .forms import LoginForm, RegistrationForm
from ..models import Users
from flask import Flask, url_for, render_template, redirect
from forms import FeedbackForm
from app.models import MU_Relationship
from . import app


@app.route('/api/feedback', methods=('GET', 'POST'))
@jwt_required
def contact():
    form = FeedbackForm(request.form)
    if form.validate():
        relationship = MU_Relationship.query.filter_by(meeting_id=form.meeting_id.data, user_id=get_jwt_identity()).first()
        relationship.review = form.review.data

        ret = {
            "msg": "success",
        }
        return jsonify(ret), 200
    return jsonify({"msg": form.errors}), 401
