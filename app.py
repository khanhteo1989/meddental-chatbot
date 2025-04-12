from flask import Flask, render_template, request, jsonify
import openai
import os
from dotenv import load_dotenv

# Load API Key từ file .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

# Trang chủ
@app.route("/")
def index():
    return render_template("index.html")

# Trang dịch vụ
@app.route("/dich-vu/implant")
def implant():
    return render_template("implant.html")

@app.route("/dich-vu/nieng-rang")
def nieng_rang():
    return render_template("nieng-rang.html")

@app.route("/dich-vu/rang-su")
def rang_su():
    return render_template("rang-su.html")

@app.route("/dich-vu/nho-rang")
def nho_rang():
    return render_template("nho-rang.html")

# API Chatbot mới
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "").strip()
    
    if not user_input:
        return jsonify({"reply": "Xin vui lòng nhập câu hỏi!"})

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Bạn là bác sĩ nha khoa MedDental, tư vấn nhẹ nhàng và chuyên nghiệp."},
                {"role": "user", "content": user_input}
            ],
            temperature=0.7
        )
        reply = response["choices"][0]["message"]["content"]
        return jsonify({"reply": reply.strip()})
    except Exception as e:
        print("❌ Chatbot error:", e)
        return jsonify({"reply": "Xin lỗi, hiện tại hệ thống đang bận."}), 500

# Trang lỗi 404
@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404 - Không tìm thấy trang</h1>", 404

# Khởi chạy ứng dụng
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

