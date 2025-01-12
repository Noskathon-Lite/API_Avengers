from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
from datetime import datetime, timedelta
import os
from functools import wraps
import random as rd
import string as st
from flask import Flask, request, jsonify
import requests
import time
import base64
import json
import hmac
import hashlib
import urllib.parse

# App Initialization
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'roshanbhatta')  # Secure this in production
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///smartpresent.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit file size to 16 MB
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)  # Ensure upload folder exists

# Initialize Database
db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    subscription = db.Column(db.String(20), default='free')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Presentation(db.Model):
    __tablename__ = 'presentation'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class chat(db.Model):
    __tablename__ = 'chat'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
class chat_response(db.Model):
    __tablename__ = 'chat_response'
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    response = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# create table text content
class TextContent(db.Model):
    __tablename__ = 'textcontent'  # Table name
    
    id = db.Column(db.Integer, primary_key=True)  # Primary key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to the user table
    textcontent = db.Column(db.Text, nullable=False)  # Main text content
    summary = db.Column(db.Text, nullable=True)  # Optional summary of the text
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 


# Create Tables
with app.app_context():
    db.create_all()

# Middleware: Token Authentication
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith("Bearer "):
            return jsonify({'success': False, 'message': 'Token is missing or invalid'}), 401
        try:
            token_data = jwt.decode(token.split()[1], app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(token_data['user_id'])
            if not current_user:
                return jsonify({'success': False, 'message': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Routes

# User Signup
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not all([data.get('name'), data.get('email'), data.get('password')]):
        return jsonify({'success': False, 'message': 'Name, email, and password are required'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'success': False, 'message': 'Email already registered'}), 400

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    token = jwt.encode({'user_id': new_user.id, 'exp': datetime.utcnow() + timedelta(days=1)},
                       app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({
        'success': True,
        'token': token,
        'user': {'id': new_user.id, 'name': new_user.name, 'email': new_user.email}
    })

# User Login
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        token = jwt.encode({'user_id': user.id, 'exp': datetime.utcnow() + timedelta(days=1)},
                           app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'success': True, 'token': token, 'user': {'id': user.id, 'email': user.email}})
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# Get Current User Info
@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_user(current_user):
    return jsonify({
        'success': True,
        'user': {
            'id': current_user.id,
            'name': current_user.name,
            'email': current_user.email,
            'subscription': current_user.subscription
        }
    })

# Fetch Presentations
@app.route('/api/presentations', methods=['GET'])
@token_required
def get_presentations(current_user):
    presentations = Presentation.query.filter_by(user_id=current_user.id).all()
    return jsonify({
        'success': True,
        'data': [{'id': p.id, 'title': p.title, 'created_at': p.created_at.isoformat()} for p in presentations]
    })

# Upload a New Presentation
@app.route('/api/presentations', methods=['POST'])
@token_required
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
    new_presentation = Presentation(user_id=current_user.id, title=request.form['title'], file_path=filepath)
    db.session.add(new_presentation)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Presentation uploaded successfully!','id':new_presentation.id})

# Serve Uploaded Files
@app.route('/uploads/<filename>', methods=['GET'])
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Fetch Single Presentation
@app.route('/api/presentations/<int:presentation_id>', methods=['GET'])
@token_required
def get_presentation(current_user, presentation_id):
    print(presentation_id,current_user)
    presentation = Presentation.query.filter_by(id=presentation_id, user_id=current_user.id).first()
    if not presentation:
        return jsonify({'success': False, 'message': 'Presentation not found'}), 404

    file_url = f"{request.host_url}uploads/{os.path.basename(presentation.file_path)}"
    return jsonify({
        'success': True,
        'file_url': file_url,
        'title': presentation.title
    })

# Define the chat endpoint
# tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
# model = TFGPT2LMHeadModel.from_pretrained('gpt2')

# Define the chat endpoint
@app.route('/api/chat', methods=['POST'])

def chat():
    """
    # Chat endpoint to handle user messages and return a GPT-2-generated response.
    # """
    # try:
    #     # Get the input message from the request JSON
    #     input_message = request.json.get('message', '')

    #     # Handle the case where no message is provided
    #     if not input_message:
    #         return jsonify({"error": "No input message provided"}), 400

    #     # Encode the input message with tokenizer
    #     encoded_input = tokenizer(
    #         input_message, 
    #         return_tensors='tf', 
    #         padding=True, 
    #         truncation=True
    #     )
    #     input_ids = encoded_input['input_ids']
    #     attention_mask = encoded_input['attention_mask']

    #     # Generate a response with the model
    #     output_ids = model.generate(
    #         input_ids=input_ids,
    #         attention_mask=attention_mask,
    #         max_length=50,
    #         num_return_sequences=1,
    #         temperature=0.7,
    #         do_sample=True
    #     )

    #     # Decode the generated output into human-readable text
    #     response_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    #     # Return the response as JSON
    #     return jsonify({"response": response_text})

    # except Exception as e:
    #     # Handle unexpected errors
    #     return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Run App
if __name__ == '__main__':
    app.run(debug=True)
