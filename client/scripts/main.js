/******************************************************************************
 * 1) ORYGINALNY KOD Z TWOJEGO DOTYCHCZASOWEGO main.js
 ******************************************************************************/
document.addEventListener('DOMContentLoaded', () => {
  // Inicjalizacja AOS
  AOS.init({
    duration: 1000,
    once: true
  });

  // Obsługa formularza rezerwacyjnego (symulacja)
  const reservationForm = document.getElementById('reservationForm');
  const formResponse = document.getElementById('formResponse');
  if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        formResponse.textContent = "Rezerwacja wysłana pomyślnie (symulacja).";
        reservationForm.reset();
      } catch (error) {
        console.error('Błąd:', error);
        formResponse.textContent = "Wystąpił błąd. Spróbuj ponownie.";
      }
    });
  }

  // Side Navigation
  window.openNav = function() {
    document.getElementById("sideNav").style.width = "250px";
  };
  window.closeNav = function() {
    document.getElementById("sideNav").style.width = "0";
  };

  // Lightbox
  const galleryImages = document.querySelectorAll('.gallery-img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox .close');
  let images = [];
  let currentIndex = 0;
  galleryImages.forEach((img, index) => {
    images.push(img.src);
    img.addEventListener('click', () => {
      currentIndex = index;
      openLightbox();
    });
  });
  function openLightbox() {
    lightbox.style.display = 'block';
    lightboxImg.src = images[currentIndex];
  }
  window.closeLightbox = function() {
    lightbox.style.display = 'none';
  };
  window.changeImage = function(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
      currentIndex = images.length - 1;
    } else if (currentIndex >= images.length) {
      currentIndex = 0;
    }
    lightboxImg.src = images[currentIndex];
  };
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    });
  }

  // Obsługa przycisku "Pokaż wszystkie" (jeśli istnieje)
  const showAllBtn = document.getElementById('showAllBtn');
  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      const extraImgs = document.querySelectorAll('#extraImages img[data-extra="true"]');
      extraImgs.forEach(extra => {
        images.push(extra.src);
      });
      currentIndex = images.length - extraImgs.length;
      openLightbox();
    });
  }

  // Widget rezerwacji + Modal
  const askForReservationBtn = document.getElementById('askForReservationBtn');
  const inputAdults = document.getElementById('adults');
  const inputChildren = document.getElementById('children');
  const inputArrival = document.getElementById('arrival');
  const inputDeparture = document.getElementById('departure');
  const reservationModal = document.getElementById('reservationModal');
  const closeModal = document.getElementById('closeModal');
  const modalAdults = document.getElementById('modalAdults');
  const modalChildren = document.getElementById('modalChildren');
  const modalArrival = document.getElementById('modalArrival');
  const modalDeparture = document.getElementById('modalDeparture');
  const detailedResForm = document.getElementById('detailedReservationForm');
  const modalFormResponse = document.getElementById('modalFormResponse');
  if (askForReservationBtn) {
    askForReservationBtn.addEventListener('click', () => {
      modalAdults.value = inputAdults.value;
      modalChildren.value = inputChildren.value;
      modalArrival.value = inputArrival.value;
      modalDeparture.value = inputDeparture.value;
      reservationModal.style.display = 'block';
    });
  }
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      reservationModal.style.display = 'none';
      modalFormResponse.textContent = "";
    });
  }
  window.onclick = function(event) {
    if (event.target === reservationModal) {
      reservationModal.style.display = 'none';
      modalFormResponse.textContent = "";
    }
  };
  if (detailedResForm) {
    detailedResForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      modalFormResponse.textContent = "Wysyłanie zapytania (symulacja)...";
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        modalFormResponse.textContent = "Wysłano zapytanie. Skontaktujemy się wkrótce.";
        detailedResForm.reset();
      } catch (error) {
        console.error('Błąd:', error);
        modalFormResponse.textContent = "Błąd wysyłki. Spróbuj ponownie.";
      }
    });
  }
});

/******************************************************************************
 * 2) KOD SKOPIOWANY 1:1 Z index.html (inline scripts)
 * Usunięty z index.html i wklejony tutaj, by wszystko było w main.js
 *****************************************************************************/

// Skrypt do poster -> wideo po hover oraz przekierowania
document.querySelectorAll('.reel-item').forEach(item => {
  item.addEventListener('click', () => {
    window.location.href = item.getAttribute('data-url');
  });
  const poster = item.querySelector('.poster');
  const video = item.querySelector('.reel-video');
  poster.style.display = 'block';
  video.style.display = 'none';
  item.addEventListener('mouseenter', () => {
    poster.style.display = 'none';
    video.style.display = 'block';
    video.play();
  });
  item.addEventListener('mouseleave', () => {
    video.pause();
    video.style.display = 'none';
    poster.style.display = 'block';
  });
});

// Skrypt Instafeed – przeniesiony 1:1
var feed = new Instafeed({
  get: 'user',
  userId: 'YOUR_USER_ID',         // Podmień na identyfikator użytkownika
  accessToken: 'YOUR_ACCESS_TOKEN',// Podmień na token dostępu
  limit: 6,
  template:
    '<a href="{{link}}" target="_blank"><img src="{{image}}" alt="{{caption}}" style="width:48px; height:48px; margin:2px; border-radius:4px;" /></a>',
  after: function() {
    var items = document.querySelectorAll('#instafeed a');
    var currentIndex = 0;
    setInterval(function() {
      items.forEach(function(item) {
        item.style.opacity = '0';
      });
      items[currentIndex].style.opacity = '1';
      currentIndex = (currentIndex + 1) % items.length;
    }, 4000);
  }
});
feed.run();
