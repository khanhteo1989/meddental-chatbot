from flask import Flask, render_template, request, jsonify
import openai
import os

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "").lower()
    if any(k in user_input for k in ["đặt lịch", "gặp bác sĩ", "tư vấn trực tiếp"]):
        return jsonify({
            "reply": "Vui lòng nhập thông tin đặt lịch bên dưới hoặc gọi 0814 419 333.",
            "handoff": True
        })

    try:
        messages = [
            {"role": "system", "content": "Bạn là bác sĩ nha khoa thuộc MedDental. Tư vấn nhẹ nhàng, chuyên môn cao, cảm xúc tích cực."},
            {"role": "user", "content": user_input}
        ]
        res = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7
        )
        reply = res['choices'][0]['message']['content']
        return jsonify({"reply": reply, "handoff": False})
    except Exception:
        return jsonify({"reply": "Xin lỗi, hệ thống đang bận. Vui lòng thử lại."})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
