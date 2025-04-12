import { useState } from "react";

export default function Chatbox() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Chào bạn! Tôi là bác sĩ nha khoa AI. Bạn cần hỗ trợ gì hôm nay?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const botReply = data.reply || "Xin lỗi, tôi chưa thể trả lời.";

      setMessages(prev => [...prev, { role: "bot", text: botReply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "bot", text: "⚠️ Hệ thống đang lỗi, vui lòng thử lại!" }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 bg-[#111827] w-[420px] max-w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-700 z-50">
      <div className="bg-green-500 p-4 text-lg font-bold text-white flex justify-between">
        <span>Bác sĩ MedDental</span>
        <button className="text-xl" onClick={() => alert("Thêm toggle nếu muốn")}>×</button>
      </div>

      <div className="h-[320px] overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded-xl text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white self-end ml-auto' : 'bg-gray-800 text-white'}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-600">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Nhập câu hỏi..."
          className="w-full px-4 py-2 rounded-lg bg-[#1f2937] text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-400"
        />
      </div>
    </div>
  );
}
