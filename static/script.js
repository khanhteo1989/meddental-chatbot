function toggleChat() {
  document.getElementById('chatbox').classList.toggle('hidden');
}

async function sendChat() {
  const input = document.getElementById("chat-input");
  const content = document.getElementById("chat-content");
  const userText = input.value.trim();
  if (!userText) return;
  content.innerHTML += `<div class='text-right text-blue-600 my-1'>${userText}</div>`;
  input.value = "";
  const res = await fetch("/chat", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userText })
  });
  const data = await res.json();
  content.innerHTML += `<div class='text-left text-gray-600 my-1'>${data.reply}</div>`;
  content.scrollTop = content.scrollHeight;
}

// Google Sheet submit
const form = document.getElementById("bookingForm");
const popup = document.getElementById("popup");

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
    alert("Lỗi khi gửi đặt lịch.");
  }
});