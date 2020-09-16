from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Length


class FeedbackForm(FlaskForm):
    class Meta:
        csrf = False

    meeting_id = IntegerField('MeetingID', [
        DataRequired()])
    
    review = StringField('Feedback', [
        DataRequired(),
        Length(min=4, message=('Your message is too short.'))])
