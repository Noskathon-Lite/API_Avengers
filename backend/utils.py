import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
from datetime import datetime, timedelta

def generate_hashed_password(password):
    return generate_password_hash(password, method='pbkdf2:sha256')

def check_password(hashed_password, password):
    return check_password_hash(hashed_password, password)

def create_jwt_token(user_id, secret_key):
    """
    Creates a JWT token with the given user ID and secret key.

    Args:
        user_id (int): The ID of the user.
        secret_key (str): The secret key for JWT encoding.

    Returns:
        str: The encoded JWT token.
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")

def decode_jwt_token(token, secret_key):
    """
    Decodes a JWT token and returns the user ID.

    Args:
        token (str): The JWT token to decode.
        secret_key (str): The secret key used for JWT encoding.

    Returns:
        int: The user ID extracted from the token, or None if decoding fails.
    """
    try:
        decoded_data = jwt.decode(token, secret_key, algorithms=["HS256"])
        return decoded_data['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def allowed_file(filename):
    """
    Checks if the given filename has an allowed extension.

    Args:
        filename (str): The filename to check.

    Returns:
        bool: True if the filename has an allowed extension, False otherwise.
    """
    ALLOWED_EXTENSIONS = {'pdf', 'pptx', 'docx'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS