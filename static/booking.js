// static/booking.js
const form = document.getElementById("bookingForm");
const popup = document.getElementById("popup");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    await fetch("https://script.google.com/macros/s/AKfycbwV8oP0helk1mcn_xUN-j5gesgo8AHPPLEWK-69hVe-umxBIA87Faej8xHAY5_XromfYQ/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    popup.classList.remove("hidden");
    form.reset();
    setTimeout(() => popup.classList.add("hidden"), 5000);
  } catch (error) {
    alert("Không gửi được. Vui lòng thử lại.");
  }
});
