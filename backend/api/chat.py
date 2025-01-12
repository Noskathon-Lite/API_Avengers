from flask import request, jsonify

from . import api_blueprint  # Assuming you create a blueprint
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")  # Replace with your actual API key

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

@api_blueprint.route('/', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'response': 'Please provide a message'}), 400

    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(user_message)

    return jsonify({'response': response.text})