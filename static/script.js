const webhookURL = "https://script.google.com/macros/s/AKfycbwV8oP0helk1mcn_xUN-j5gesgo8AHPPLEWK-69hVe-umxBIA87Faej8xHAY5_XromfYQ/exec";
let lottiePlayer = null;

function sendMessage() {
  const input = document.getElementById("user-input");
  const msg = input.value.trim();
  if (!msg) return;

  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<div class="user-msg"><div class="msg">${msg}</div></div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  })
    .then(res => res.json())
    .then(data => {
      chatBox.innerHTML += `
        <div class="bot-msg">
          <img src="/static/avatar.png" class="avatar">
          <div class="msg">${data.reply}</div>
        </div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
      if (data.handoff) openPopup();
    });
}

function openPopup() {
  document.getElementById("booking-popup").classList.remove("hidden");
}
function closePopup() {
  document.getElementById("booking-popup").classList.add("hidden");
}

document.getElementById("booking-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    ten: form.ten.value,
    tuoi: form.tuoi.value,
    benhly: form.benhly.value,
    coso: form.coso.value,
    gio_goilai: form.gio_goilai.value
  };
  const res = await fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    showSuccessToast("🎉 Đặt lịch thành công! CSKH sẽ gọi lại.");
    closePopup();
    form.reset();
  } else {
    alert("❌ Có lỗi xảy ra, vui lòng thử lại.");
  }
});

function showSuccessToast(message) {
  document.getElementById("pling-sound").play();

  const container = document.getElementById("lottie-success");
  container.classList.remove("hidden");
  if (!lottiePlayer) {
    lottiePlayer = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "https://assets5.lottiefiles.com/packages/lf20_jbrw3hcz.json"
    });
  } else {
    lottiePlayer.goToAndPlay(0);
  }
  setTimeout(() => container.classList.add("hidden"), 2000);

  const toast = document.getElementById("success-toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 4000);
}

