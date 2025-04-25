// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
  // ————————————————————————————————————————————————
  // 1) Inicjalizacja AOS
  // ————————————————————————————————————————————————
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      once: true
    });
  }

  // ————————————————————————————————————————————————
  // 2) Symulacja wysyłki prostego formularza rezerwacyjnego
  // ————————————————————————————————————————————————
  const reservationForm = document.getElementById('reservationForm');
  const formResponse    = document.getElementById('formResponse');
  if (reservationForm && formResponse) {
    reservationForm.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        await new Promise(r => setTimeout(r, 1000));
        formResponse.textContent = "Rezerwacja wysłana pomyślnie (symulacja).";
        reservationForm.reset();
      } catch (err) {
        console.error('Błąd symulacji rezerwacji:', err);
        formResponse.textContent = "Wystąpił błąd. Spróbuj ponownie.";
      }
    });
  }

  // ————————————————————————————————————————————————
  // 3) Side Navigation
  // ————————————————————————————————————————————————
  window.openNav  = () => { const nav = document.getElementById("sideNav"); if (nav) nav.style.width = "250px"; };
  window.closeNav = () => { const nav = document.getElementById("sideNav"); if (nav) nav.style.width = "0"; };

  // ————————————————————————————————————————————————
  // 4) Lightbox galerii
  // ————————————————————————————————————————————————
  const galleryImages = document.querySelectorAll('.gallery-img');
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox .close');
  let images = [], currentIndex = 0;

  galleryImages.forEach((img, idx) => {
    images.push(img.src);
    img.addEventListener('click', () => {
      currentIndex = idx;
      if (lightbox && lightboxImg) {
        lightbox.style.display = 'block';
        lightboxImg.src = images[currentIndex];
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      if (lightbox) lightbox.style.display = 'none';
    });
  }
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) lightbox.style.display = 'none';
    });
  }
  window.closeLightbox = () => { if (lightbox) lightbox.style.display = 'none'; };
  window.changeImage   = direction => {
    if (!images.length || !lightboxImg) return;
    currentIndex = (currentIndex + direction + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  };

  // ————————————————————————————————————————————————
  // 5) "Pokaż wszystkie" (rozszerzenie galerii o extraImages)
  // ————————————————————————————————————————————————
  const showAllBtn = document.getElementById('showAllBtn');
  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      const extra = document.querySelectorAll('#extraImages img[data-extra="true"]');
      extra.forEach(img => images.push(img.src));
      currentIndex = images.length - extra.length;
      if (lightbox && lightboxImg) {
        lightbox.style.display = 'block';
        lightboxImg.src = images[currentIndex];
      }
    });
  }

  // ————————————————————————————————————————————————
  // 6) Szybki formularz "Zapytaj o rezerwację" + Modal "wizard"
  // ————————————————————————————————————————————————
  const askBtn         = document.getElementById('askForReservationBtn');
  const inputAdults    = document.getElementById('adults');
  const inputChildren  = document.getElementById('children');
  const inputArrival   = document.getElementById('arrival');
  const inputDeparture = document.getElementById('departure');
  const reservationModal = document.getElementById('reservationModal');
  const closeModalBtn    = document.getElementById('closeModal');
  const modalAdults      = document.getElementById('modalAdults');
  const modalChildren    = document.getElementById('modalChildren');
  const modalArrival     = document.getElementById('modalArrival');
  const modalDeparture   = document.getElementById('modalDeparture');
  const detailedForm     = document.getElementById('detailedReservationForm');
  const modalResponse    = document.getElementById('modalFormResponse');

  if (askBtn) {
    askBtn.addEventListener('click', () => {
      if (modalAdults    && inputAdults)    modalAdults.value    = inputAdults.value;
      if (modalChildren  && inputChildren)  modalChildren.value  = inputChildren.value;
      if (modalArrival   && inputArrival)   modalArrival.value   = inputArrival.value;
      if (modalDeparture && inputDeparture) modalDeparture.value = inputDeparture.value;
      if (reservationModal) reservationModal.style.display = 'block';
    });
  }

  if (closeModalBtn && reservationModal) {
    closeModalBtn.addEventListener('click', () => {
      reservationModal.style.display = 'none';
      if (modalResponse) modalResponse.textContent = "";
    });
  }

  window.onclick = e => {
    if (e.target === reservationModal) {
      reservationModal.style.display = 'none';
      if (modalResponse) modalResponse.textContent = "";
    }
  };

  if (detailedForm && modalResponse) {
    detailedForm.addEventListener('submit', async e => {
      e.preventDefault();
      modalResponse.textContent = "Wysyłanie zapytania (symulacja)…";
      try {
        await new Promise(r => setTimeout(r, 1000));
        modalResponse.textContent = "Wysłano zapytanie. Skontaktujemy się wkrótce.";
        detailedForm.reset();
      } catch (err) {
        console.error('Błąd symulacji wysyłki:', err);
        modalResponse.textContent = "Błąd wysyłki. Spróbuj ponownie.";
      }
    });
  }

  // ————————————————————————————————————————————————
  // 7) Reel-item hover / click (inline ze strony głównej)
  // ————————————————————————————————————————————————
  document.querySelectorAll('.reel-item').forEach(item => {
    item.addEventListener('click', () => {
      const url = item.getAttribute('data-url');
      if (url) window.location.href = url;
    });
    const poster = item.querySelector('.poster');
    const video  = item.querySelector('.reel-video');
    if (poster && video) {
      poster.style.display = 'block';
      video.style.display  = 'none';
      item.addEventListener('mouseenter', () => {
        poster.style.display = 'none';
        video.style.display  = 'block';
        video.play();
      });
      item.addEventListener('mouseleave', () => {
        video.pause();
        video.style.display  = 'none';
        poster.style.display = 'block';
      });
    }
  });

  // ————————————————————————————————————————————————
  // 8) Instafeed
  // ————————————————————————————————————————————————
  if (window.Instafeed) {
    var feed = new Instafeed({
      get: 'user',
      userId: 'YOUR_USER_ID',
      accessToken: 'YOUR_ACCESS_TOKEN',
      limit: 6,
      template: '<a href="{{link}}" target="_blank"><img src="{{image}}" alt="{{caption}}" style="width:48px;height:48px;margin:2px;border-radius:4px;" /></a>',
      after: () => {
        const items = document.querySelectorAll('#instafeed a');
        let idx = 0;
        setInterval(() => {
          items.forEach(i => i.style.opacity = '0');
          items[idx].style.opacity = '1';
          idx = (idx + 1) % items.length;
        }, 4000);
      }
    });
    feed.run();
  }
});
