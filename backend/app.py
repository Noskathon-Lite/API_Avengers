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
import pdfplumber
import pdfplumber
import google.generativeai as genai

# from transformers import pipeline
# from transformers import T5ForConditionalGeneration, T5Tokenizer


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
    diagram_code=db.Column(db.Text, nullable=True)  # Optional diagram code
    summary_to_speech_path=db.Column(db.Text, nullable=True)  # Optional summary to speech
    textcontent_id=db.Column(db.Integer, nullable=False)  # Foreign key to the textcontent table

# Create Tables
with app.app_context():
    db.create_all()
# there is fuction to read text and summarize it
# def text_abstractor(filepath):
#     with pdfplumber.open(filepath) as pdf:
#         text = ''
#         for i in range(len(pdf.pages)):
#             text += pdf.pages[i].extract_text()
#     return text
# def summary_text(text):
#     """
#     Summarizes the given text into 10 points using the T5 model.

#     Args:
#         text (str): The input text to summarize.

#     Returns:
#         list: A list containing 10 summary points.
#     """
#     # Load pre-trained T5 model and tokenizer
#     model_name = "t5-small"
#     tokenizer = T5Tokenizer.from_pretrained(model_name)
#     model = T5ForConditionalGeneration.from_pretrained(model_name)

#     # Preprocess the input text for T5
#     input_text = "summarize: " + text
#     inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)

#     # Generate summary
#     summary_ids = model.generate(
#         inputs,
#         max_length=200,  # Maximum token length of the generated summary
#         min_length=50,   # Minimum token length of the generated summary
#         length_penalty=2.0,
#         num_beams=4,
#         early_stopping=True
#     )

#     # Decode the output and split it into points
#     summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
#     points = summary.split(".")  # Split the summary into points

#     # Filter and clean up points
#     points = [point.strip() for point in points if point.strip()]  # Remove empty strings and spaces

#     # Ensure there are exactly 10 points by truncating or padding
#     if len(points) > 10:
#         points = points[:10]
#     elif len(points) < 10:
#         points += ["No additional point."] * (10 - len(points))

#     return points

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
        return f(current_user, *args, **kwargs) # Call the route function with the current user as an argument
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
    summarize_text_from_pdf(filepath, current_user, new_presentation.id)
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
# model.load_weights('gpt2_weights.h5')
@app.route('/api/chat', methods=['POST'])

def chat():
    genai.configure(api_key="AIzaSyBNA5sSYFNQdAMEp_PuG8KxCh5pRqkxuPA")
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }
    
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash-exp",
        generation_config=generation_config,
        system_instruction="imagine your name is Robha and you help the student with their confusion\n",
    )
    
    user_message = request.json.get('message')  # Get the user's message from the request
    if not user_message:
        return jsonify({'response': 'Please provide a message'}), 400
    # Start a chat session and get the response
    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(user_message)

    return jsonify({'response': response.text})
     # Send the reply back to the frontend with the key 'response'

# summary of pdf file
def summarize_text_from_pdf(pdf_path, current_user, presentation_id):
    # Step 1: Extract text from the PDF
    try:
        with pdfplumber.open(pdf_path) as pdf:
            extracted_text = ''
            for page in pdf.pages:
                extracted_text += page.extract_text() + '\n'
    except Exception as e:
        return f"Error reading PDF: {e}"

    if not extracted_text.strip():
        return "The PDF contains no readable text."

    # Step 2: Configure the Gemini API
    genai.configure(api_key="AIzaSyBITQTk3JDKIHUUB9Yt-vVQqDJ80JGIK-E")
    generation_config = {
        "temperature": 2,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash-exp",
        generation_config=generation_config,
        system_instruction="You are a text summarization expert. Summarize the text from the PDF into concise bullet points. Each point should capture key ideas, facts, or themes, and avoid redundancy. The summary should:\n\n- Be clear and concise.\n- Contain only relevant information.\n- Be written in plain, understandable language.\n",
    )
    # Step 3: Start a chat session and send the extracted text for summarization
    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(extracted_text)
    db.session.add(TextContent(user_id=current_user.id, textcontent=extracted_text, summary=response.text,textcontent_id=presentation_id))
    db.session.commit()

# Fetch Summaries for a Specific Presentation
@app.route('/api/presentations/<int:presentation_id>/summary', methods=['GET'])
@token_required
def get_presentation_summary(current_user, presentation_id):
    text_content = TextContent.query.filter_by(user_id=current_user.id, textcontent_id=presentation_id).first()
    if not text_content:
        return jsonify({'success': False, 'message': 'Summary not found'}), 404

    return jsonify({
        'success': True,
        'summary': text_content.summary
    })



if __name__ == '__main__':
    app.run(debug=True)
