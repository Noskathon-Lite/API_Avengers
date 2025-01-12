from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Initialize Flask app
app = Flask(__name__)

# Configure settings (replace with your actual values)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///smartpresent.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Initialize extensions
db = SQLAlchemy(app)
CORS(app)
jwt = JWTManager(app)

# Import and register blueprints
from .api.auth import api_blueprint as auth_bp
from .api.presentations import api_blueprint as presentations_bp
from .api.chat import api_blueprint as chat_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(presentations_bp, url_prefix='/api/presentations')
app.register_blueprint(chat_bp, url_prefix='/api/chat')

# Create database tables
with app.app_context():
    db.create_all()