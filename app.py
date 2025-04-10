from flask import Flask, render_template, request, jsonify
import openai
import os

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/")
def index():
    return render_template("index.html")  # hoặc home.html nếu bạn giữ tên đó


@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Bạn là bác sĩ nha khoa tại MedDental..."},
            {"role": "user", "content": user_input}
        ]
    )
    reply = response['choices'][0]['message']['content']
    return jsonify({"reply": reply, "handoff": "đặt lịch" in user_input.lower()})

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
