from flask import request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity

from . import api_blueprint
from ..models import Presentation
from ..utils import allowed_file

import os
from werkzeug.utils import secure_filename
from .. import app, db


@api_blueprint('/api/presentations', methods=['GET'])
@jwt_required
def get_presentations(current_user):
    presentations = Presentation.query.filter_by(user_id=current_user.id).all()
    return jsonify({
        'success': True,
        'data': [{'id': p.id, 'title': p.title, 'created_at': p.created_at.isoformat()} for p in presentations]
    })

# Upload a New Presentation
@api_blueprint('/api/presentations', methods=['POST'])
@jwt_required
def upload_presentation(current_user):
    if 'file' not in request.files or 'title' not in request.form:
        return jsonify({'success': False, 'message': 'Title and file are required'}), 400

    file = request.files['file']
    if not file.filename:
        return jsonify({'success': False, 'message': 'No file selected'}), 400

    allowed_extensions = {'pdf', 'pptx', 'docx'}
    if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'success': False, 'message': 'Invalid file type'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    # abstracted_text=text_abstractor(filepath)
    # summary_text_final=summary_text(abstracted_text)
    # # change the text to array after each point
    # summary_text_final = [point for point in summary_text_final]
    # # Save the text content to the database
    # new_text_content = TextContent(user_id=current_user.id, textcontent=abstracted_text, summary=summary_text_final)
    # db.session.add(new_text_content)
    new_presentation = Presentation(user_id=current_user.id, title=request.form['title'], file_path=filepath)
    db.session.add(new_presentation)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Presentation uploaded successfully!','id':new_presentation.id})
