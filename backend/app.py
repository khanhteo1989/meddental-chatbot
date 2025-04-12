from flask import Flask, request, jsonify
import openai, os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "")
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Bạn là bác sĩ nha khoa MedDental, tư vấn nhẹ nhàng và chuyên nghiệp."},
                {"role": "user", "content": user_input}
            ]
        )
        reply = response["choices"][0]["message"]["content"]
        return jsonify({ "reply": reply.strip() })
    except Exception as e:
        print("Chatbot Error:", e)
        return jsonify({ "reply": "Xin lỗi, hệ thống đang bận." }), 500
