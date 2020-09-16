from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, EqualTo, ValidationError

from ..models import Users


class LoginForm(FlaskForm):

    class Meta:
        csrf = False

    username = StringField('username', validators=[DataRequired()])
    password = StringField('password', validators=[DataRequired()])


class RegistrationForm(FlaskForm):

    class Meta:
        csrf = False

    username = StringField('username', validators=[DataRequired()])
    password = StringField('password', validators=[DataRequired()])
    email = StringField('email', validators=[DataRequired(), Email()])
    rakuten_id = StringField('rakuten id')
    zoom_id = StringField('zoom id')

    def validate_username(self, username):
        user = Users.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Please use a different username.')
