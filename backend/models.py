from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from backend import db

class User(db.Model):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    subscription = Column(String(20), default='free')
    created_at = Column(DateTime, default=datetime.utcnow)

class Presentation(db.Model):
    __tablename__ = 'presentation'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    title = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class TextContent(db.Model):
    __tablename__ = 'textcontent'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    textcontent = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    diagram_code = Column(Text, nullable=True)
    summary_to_speech_path = Column(Text, nullable=True)

class Chat(db.Model):  # Renamed for clarity
    __tablename__ = 'chat'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    message = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatResponse(db.Model):  # Renamed for clarity
    __tablename__ = 'chat_response'
    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey('chat.id'), nullable=False)
    response = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)