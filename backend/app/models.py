from datetime import datetime
from app import db
from werkzeug.security import check_password_hash, generate_password_hash


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    zoom_id = db.Column(db.String(32))
    rakuten_id = db.Column(db.String(32))
    allergies = db.Column(db.String(128))
    email = db.Column(db.String(64))

    def __repr__(self):
        return '<Users {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def confirmed_meetings(self):
        meetings = Meetings.query.join(
            MU_Relationship, (MU_Relationship.meeting_id == Meetings.id)).filter(
            MU_Relationship.user_id == self.id, MU_Relationship.approved == True)
        return meetings.query.filter(Meetings.datetime > datetime.utcnow())\
            .order_by(Meetings.datetime.desc())

    def invited_meetings(self):
        meetings = Meetings.query.join(
            MU_Relationship, (MU_Relationship.meeting_id == Meetings.id)).filter(
            MU_Relationship.user_id == self.id, MU_Relationship.approved==False)
        return meetings.query.filter(Meetings.datetime > datetime.utcnow())\
            .order_by(Meetings.datetime.desc())

    def past_meetings(self):
        meetings = Meetings.query.join(
            MU_Relationship, (MU_Relationship.meeting_id == Meetings.id)).filter(
            MU_Relationship.user_id == self.id)
        return meetings.query.filter(Meetings.datetime < datetime.utcnow())\
            .order_by(Meetings.datetime.desc())


class Meetings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    zoom_url = db.Column(db.String(2083))
    leader_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    datetime = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    def __repr__(self):
        return '<Meeting {}>'.format(self.name)


class MU_Relationship(db.Model):
    meeting_id = db.Column(db.Integer,
                           db.ForeignKey('meetings.id'),
                           primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    approved = db.Column(db.Boolean, nullable=False, default=False)
    review = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return '<MU_Relationship {}>'.format(self.meeting_id)


class Items(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    meeting_id = db.Column(db.Integer, db.ForeignKey('meetings.id'))
    product_id = db.Column(db.String(64), index=True, unique=True)
    amount = db.Column(db.Integer)
    price = db.Column(db.Integer)

    def __repr__(self):
        return '<Items {}>'.format(self.item_id)
