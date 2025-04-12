// Gửi form Google Sheets
const form = document.getElementById("bookingForm");
const popup = document.getElementById("popup");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const json = Object.fromEntries(formData.entries());

    try {
      await fetch("https://script.google.com/macros/s/AKfycbwV8oP0helk1mcn_xUN-j5gesgo8AHPPLEWK-69hVe-umxBIA87Faej8xHAY5_XromfYQ/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(json)
      });

      popup.classList.remove("hidden");
      form.reset();
      setTimeout(() => popup.classList.add("hidden"), 4000);
    } catch (err) {
      alert("Lỗi gửi thông tin. Vui lòng thử lại.");
    }
  });
}

// Toggle Chatbox
function toggleChat() {
  const box = document.getElementById("chatbox");
  box.classList.toggle("hidden");
}

// Gửi tin nhắn tới ChatGPT
async function sendChat() {
  const input = document.getElementById("chat-input");
  const content = document.getElementById("chat-content");
  const userText = input.value.trim();
  if (!userText) return;

  // Bubble người dùng
  const userBubble = document.createElement("div");
  userBubble.className = "bg-blue-600 text-white px-3 py-2 rounded-lg self-end max-w-[80%] ml-auto animate-fade-in";
  userBubble.textContent = userText;
  content.appendChild(userBubble);
  input.value = "";
  content.scrollTop = content.scrollHeight;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });

    const data = await res.json();
    const reply = data.reply || "Xin lỗi, tôi chưa thể trả lời ngay.";

    const botBubble = document.createElement("div");
    botBubble.className = "bg-gray-200 text-gray-800 px-3 py-2 rounded-lg max-w-[80%] animate-fade-in";
    botBubble.textContent = reply;
    content.appendChild(botBubble);
    content.scrollTop = content.scrollHeight;
  } catch (err) {
    const errorBubble = document.createElement("div");
    errorBubble.className = "bg-red-100 text-red-600 px-3 py-2 rounded-lg max-w-[80%]";
    errorBubble.textContent = "Lỗi mạng hoặc hệ thống đang bận.";
    content.appendChild(errorBubble);
  }
}
