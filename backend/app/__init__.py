from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from app.models import db
from app.routes import register_routes

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Load configuration
    app.config.from_object('config.Config')
    
    # Initialize extensions
    db.init_app(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Register routes
    register_routes(app)
    
    return app
