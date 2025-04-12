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

// Gửi chat tới Flask
async function sendChat() {
  const input = document.getElementById("chat-input");
  const content = document.getElementById("chat-content");
  const userText = input.value.trim();
  if (!userText) return;

  // Hiển thị người dùng
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

    // Trường hợp cần handoff -> chèn form đặt lịch
    if (data.handoff) {
      const formHTML = `
        <div class="bg-gray-100 p-3 rounded-md mt-2 text-sm space-y-2 animate-fade-in">
          <p><strong>Đặt lịch khám:</strong></p>
          <input type="text" placeholder="Họ tên" class="w-full border p-1 rounded" id="form-name">
          <input type="tel" placeholder="Số điện thoại" class="w-full border p-1 rounded" id="form-phone">
          <textarea placeholder="Nội dung cần tư vấn" class="w-full border p-1 rounded" id="form-note" rows="2"></textarea>
          <button onclick="submitBooking()" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Gửi đặt lịch</button>
        </div>`;
      const botBubble = document.createElement("div");
      botBubble.innerHTML = formHTML;
      content.appendChild(botBubble);
    } else {
      const botBubble = document.createElement("div");
      botBubble.className = "bg-gray-200 text-gray-800 px-3 py-2 rounded-lg max-w-[80%] animate-fade-in";
      botBubble.textContent = reply;
      content.appendChild(botBubble);
    }

    content.scrollTop = content.scrollHeight;
  } catch (err) {
    const errorBubble = document.createElement("div");
    errorBubble.className = "bg-red-100 text-red-600 px-3 py-2 rounded-lg max-w-[80%]";
    errorBubble.textContent = "Lỗi mạng hoặc hệ thống đang bận.";
    content.appendChild(errorBubble);
  }
}

// Gửi đặt lịch từ form chatbot
async function submitBooking() {
  const name = document.getElementById("form-name").value.trim();
  const phone = document.getElementById("form-phone").value.trim();
  const note = document.getElementById("form-note").value.trim();

  if (!name || !phone) {
    alert("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
    return;
  }

  try {
    await fetch("https://script.google.com/macros/s/AKfycbwV8oP0helk1mcn_xUN-j5gesgo8AHPPLEWK-69hVe-umxBIA87Faej8xHAY5_XromfYQ/exec", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ ten: name, sdt: phone, noidung: note || "Đặt lịch từ chatbot" })
    });

    const content = document.getElementById("chat-content");
    const confirm = document.createElement("div");
    confirm.className = "bg-green-100 text-green-700 px-3 py-2 rounded-lg max-w-[80%] mt-2";
    confirm.textContent = "✔️ Đặt lịch thành công! Chúng tôi sẽ liên hệ sớm.";
    content.appendChild(confirm);
    content.scrollTop = content.scrollHeight;
  } catch (err) {
    alert("Lỗi gửi đặt lịch. Vui lòng thử lại.");
  }
}
