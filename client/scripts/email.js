// scripts/email.js

// ← podmień na swoje ID:
const SERVICE_ID  = 'service_g6tanel';
const TEMPLATE_ID = 'template_991rdou';

// Mapa kodów pokoi na polskie nazwy
const ROOM_LABELS = {
  studio34: 'Studio 3–4 os.',
  studio4:  'Studio 4 os.',
  double:   'Pokój dwuosobowy'
};

function initEmailForms() {
  document.querySelectorAll('.email-form').forEach(form => {
    const resp           = form.querySelector('.form-response');
    const btn            = form.querySelector('button[type="submit"]');
    const arrival        = form.querySelector('[name="modalArrival"]');
    const depart         = form.querySelector('[name="modalDeparture"]');
    const roomTypeInput  = form.querySelector('[name="roomType"]'); // ukryte pole

    // Dynamiczne ograniczenie dat UI
    arrival.addEventListener('change', () => {
      depart.min = arrival.value;
    });
    depart.addEventListener('change', () => {
      arrival.max = depart.value;
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      resp.classList.remove('success', 'error');
      resp.textContent = '';

      // 0) Honeypot: jeśli pole _hp jest wypełnione, uznaj za bota i odrzuć
      const hp = form.querySelector('[name="_hp"]').value;
      if (hp) {
        console.warn('Honeypot wypełniony — zgłoszenie odrzucone.');
        return;
      }

      // 1) HTML5‐owa walidacja
      if (!form.checkValidity()) {
        resp.classList.add('error');
        resp.textContent = 'Proszę wypełnić wszystkie wymagane pola poprawnie.';
        form.reportValidity();
        return;
      }

      // 2) Sprawdzenie dat
      const arriveVal = arrival.value;
      const departVal = depart.value;
      if (arriveVal && departVal) {
        const arriveD = new Date(arriveVal);
        const departD = new Date(departVal);
        if (arriveD > departD) {
          resp.classList.add('error');
          resp.textContent = 'Data przyjazdu musi być przed datą wyjazdu.';
          return;
        }
      }

      // ➤ Ustawiamy polską nazwę pokoju tuż przed wysyłką
      const activeRoomBtn = document.querySelector('.room-selector button.active');
      if (roomTypeInput && activeRoomBtn) {
        const key = activeRoomBtn.dataset.room;              // "studio34", "studio4" lub "double"
        roomTypeInput.value = ROOM_LABELS[key] || key;       // np. "Pokój dwuosobowy"
      }

      // 3) Disable button, pokaż stan
      btn.disabled    = true;
      btn.textContent = 'Wysyłanie…';

      // 4) Wyślij przez EmailJS
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
        .then(() => {
          resp.classList.add('success');
          resp.textContent = 'Wysłano pomyślnie!';
          form.reset();
          depart.min      = '';
          arrival.max     = '';
          // przywróć domyślną wartość pokoju
          if (roomTypeInput) roomTypeInput.value = ROOM_LABELS.studio34;
        })
        .catch(err => {
          console.error('EmailJS error:', err);
          resp.classList.add('error');
          resp.textContent = 'Błąd wysyłki, spróbuj ponownie.';
        })
        .finally(() => {
          btn.disabled    = false;
          btn.textContent = 'Wyślij zapytanie';
        });
    });
  });
}

document.addEventListener('DOMContentLoaded', initEmailForms);
