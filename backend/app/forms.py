from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextField, Length, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, ValidationError
from ..models import Users


class FeedbackForm(FlaskForm):
    """Feedback form."""
    meeting_id = IntegerField('MeetingID', [
        DataRequired()])
    
    review = TextField('Feedback', [
        DataRequired(),
        Length(min=4, message=('Your message is too short.'))])
    
    # submit = SubmitField('Submit')
