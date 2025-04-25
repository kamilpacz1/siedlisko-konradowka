// scripts/wizard.js

(function(){
  // 1) Pobranie elementów
  const modal = document.getElementById('reservationModal');
  const form  = document.getElementById('wizardForm');
  if (!modal || !form) {
    console.warn('Wizard: brak modal lub formularza');
    return;
  }

  // 2) Ustawienie domyślnego typu obiektu
  const hiddenRoomType  = form.querySelector('#roomTypeField');
  const displayRoomType = form.querySelector('#selectedRoomType');
  if (window.defaultRoomType) {
    hiddenRoomType.value  = window.defaultRoomType;
    displayRoomType.value = window.defaultRoomType;
  }

  // 3) Zamknięcie modala
  // a) klik w tło
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  // b) klik w ikonę ✕
  const closeIcon = document.getElementById('closeModal');
  if (closeIcon) {
    closeIcon.addEventListener('click', e => {
      e.stopPropagation();
      modal.style.display = 'none';
    });
  }

  // 4) Blokada wyboru przeszłych dat
  const arrival   = form.querySelector('#modalArrival');
  const departure = form.querySelector('#modalDeparture');
  if (arrival && departure) {
    const today = new Date().toISOString().slice(0,10);
    arrival.min   = today;
    departure.min = today;

    arrival.addEventListener('change', () => {
      departure.min = arrival.value || today;
      if (departure.value && departure.value < arrival.value) {
        departure.value = '';
      }
    });
    departure.addEventListener('change', () => {
      arrival.max = departure.value;
      if (arrival.value && arrival.value > departure.value) {
        arrival.value = '';
      }
    });
  }

  // 5) Krokowy formularz
  const steps      = Array.from(form.querySelectorAll('.step'));
  const indicators = Array.from(modal.querySelectorAll('.step-indicator'));
  const prevBtn    = form.querySelector('#prevBtn');
  const nextBtn    = form.querySelector('#nextBtn');
  const submitBtn  = form.querySelector('#submitBtn');
  let currentStep  = 0;

  function showStep(n) {
    steps.forEach((s,i) => s.style.display = i === n ? 'block' : 'none');
    indicators.forEach((ind,i) => ind.classList.toggle('active', i === n));
    prevBtn.disabled        = (n === 0);
    nextBtn.style.display   = (n === steps.length - 1 ? 'none' : 'inline-block');
    submitBtn.style.display = (n === steps.length - 1 ? 'inline-block' : 'none');

    if (n === steps.length - 1) {
      const sum = form.querySelector('.summary');
      sum.innerHTML = `
        <p><strong>Obiekt:</strong> ${displayRoomType.value}</p>
        <p><strong>Pobyt:</strong> ${arrival.value} – ${departure.value}</p>
        <p><strong>Dorośli:</strong> ${form.querySelector('#modalAdults').value}, 
           <strong>Dzieci:</strong> ${form.querySelector('#modalChildren').value}, 
           <strong>Zwierzęta:</strong> ${form.querySelector('#modalAnimals').value || 0}</p>
        <p><strong>Kontakt:</strong> ${form.querySelector('#firstName').value} 
           ${form.querySelector('#lastName').value}, tel. ${form.querySelector('#phone').value}, 
           email ${form.querySelector('#email').value}</p>
      `;
    }
  }

  nextBtn.addEventListener('click', () => {
    // walidacja bieżącego kroku
    const inputs = steps[currentStep].querySelectorAll('input,textarea');
    for (let inp of inputs) {
      if (!inp.checkValidity()) {
        inp.reportValidity();
        return;
      }
    }
    currentStep++;
    showStep(currentStep);
  });

  prevBtn.addEventListener('click', () => {
    currentStep--;
    showStep(currentStep);
  });

  // 6) Pozwól EmailJS przechwycić submit
  // Usuń lub zakomentuj wszystkie e.preventDefault() związane z form.submit()

  // 7) Wyświetlamy pierwszy krok
  showStep(0);
})();
