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

// Toggle chatbot
function toggleChat() {
  const box = document.getElementById("chatbox");
  if (box) box.classList.toggle("hidden");
}

// Gửi chat tới chatbot AI
async function sendChat() {
  const input = document.getElementById("chat-input");
  const content = document.getElementById("chat-content");
  const userText = input.value.trim();
  if (!userText) return;

  // Hiển thị tin người dùng
  const userDiv = document.createElement("div");
  userDiv.className = "text-right text-blue-600 my-1 animate-fade-in";
  userDiv.textContent = userText;
  content.appendChild(userDiv);

  // Âm thanh gửi
  try {
    const sound = new Audio("/static/click.mp3");
    sound.play();
  } catch (_) {}

  input.value = "";
  content.scrollTop = content.scrollHeight;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });

    const data = await res.json();
    const reply = data.reply || "Xin lỗi, hiện tại tôi chưa xử lý được.";

    const botDiv = document.createElement("div");
    botDiv.className = "text-left text-gray-600 my-1 animate-fade-in";
    botDiv.textContent = reply;
    content.appendChild(botDiv);
    content.scrollTop = content.scrollHeight;

  } catch (err) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "text-left text-red-600 my-1 animate-fade-in";
    errorDiv.textContent = "Mạng yếu hoặc server đang gặp sự cố.";
    content.appendChild(errorDiv);
  }
}
