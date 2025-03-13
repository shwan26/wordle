from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import random

app = Flask(__name__)
CORS(app)

# Initialize Firebase
cred = credentials.Certificate('firebase_config.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_random_word():
    words_ref = db.collection('words')
    docs = words_ref.stream()
    word_list = [doc.to_dict()['word'] for doc in docs]
    return random.choice(word_list).upper()

@app.route('/new-game', methods=['GET'])
def new_game():
    word = get_random_word()
    return jsonify({"solution": word}), 200

@app.route('/check-word', methods=['POST'])
def check_word():
    data = request.get_json()
    print("Received data:", data)  # Debugging line

    # Ensure 'word' and 'solution' exist in request
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

    is_correct = user_word == solution_word
    return jsonify({"result": result, "correct": is_correct}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
