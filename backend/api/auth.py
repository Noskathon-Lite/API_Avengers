from flask import request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

from . import api_blueprint
from ..models import User
from .. import db

@api_blueprint.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'Invalid JSON input'}), 400
    if not all([data.get('name'), data.get('email'), data.get('password')]):
        return jsonify({'success': False, 'message': 'Name, email, and password are required'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'success': False, 'message': 'Email already registered'}), 400

    hashed_password = generate_password_hash(data['password'])
    new_user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)

    return jsonify({
        'success': True,
        'token': access_token,
        'user': {'id': new_user.id, 'name': new_user.name, 'email': new_user.email}
    }), 201

@api_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'Invalid JSON input'}), 400
    user = User.query.filter_by(email=data.get('email')).first()
    if user and check_password_hash(user.password, data.get('password')):
        access_token = create_access_token(identity=user.id)
        return jsonify({'success': True, 'token': access_token, 'user': {'id': user.id, 'email': user.email}})
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@api_blueprint.route('/me', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    return jsonify({
        'success': True,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
    }), 200
