// scripts/load-footer.js
document.addEventListener("DOMContentLoaded", () => {
    const footerTarget = document.getElementById("footer-placeholder");
    if (footerTarget) {
      fetch("footer.html")
        .then((res) => res.text())
        .then((html) => {
          footerTarget.innerHTML = html;
        })
        .catch((err) => console.error("Błąd ładowania stopki:", err));
    }
  });
  