from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import random

app = Flask(__name__)
CORS(app)

# Initialize Firebase (Ensure it's initialized only once)
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_config.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_random_word():
    words_ref = db.collection('words')
    docs = words_ref.stream()
    word_list = [doc.to_dict() for doc in docs]

    if not word_list:
        return None, None  # No words found

    chosen_word = random.choice(word_list)
    word = chosen_word.get('word', '').upper()
    image_url = chosen_word.get('url', '')

    return word, image_url

@app.route('/api/new-game', methods=['GET'])  # Use `/api` for Vercel compatibility
def new_game():
    word, image_url = get_random_word()
    if not word:
        return jsonify({"error": "No words found in Firestore"}), 500
    return jsonify({"solution": word, "image_url": image_url}), 200

@app.route('/api/check-word', methods=['POST'])
def check_word():
    data = request.get_json()
    user_word = data.get('word', '').upper()
    solution_word = data.get('solution', '').upper()

    if not user_word or not solution_word:
        return jsonify({"error": "Missing word or solution"}), 400

    result = []
    for i, char in enumerate(user_word):
        if char == solution_word[i]:
            result.append('correct')
        elif char in solution_word:
            result.append('present')
        else:
            result.append('absent')

    return jsonify({"result": result, "correct": user_word == solution_word}), 200

# Required for Vercel Serverless Functions
def handler(event, context):
    return app(event, context)
