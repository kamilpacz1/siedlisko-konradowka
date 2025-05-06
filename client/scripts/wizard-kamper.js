const modal      = document.getElementById('reservationModal');
const closeModal = document.getElementById('closeModal');
const form       = document.getElementById('wizardForm');
const steps      = Array.from(form.querySelectorAll('.wizard-step'));
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');
const submitBtn  = document.getElementById('submitBtn');
const summaryBox = document.getElementById('summary');
const responseEl = form.querySelector('.form-response');
let currentStep  = 0;

// ——————————————
// 1. BLOKADA DAT PRZESZŁYCH
// ——————————————
(function disablePastDates() {
  const today = new Date().toISOString().split('T')[0];
  ['arrival', 'departure', 'w-arrival', 'w-departure']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el && el.type === 'date') el.min = today;
    });
})();

function showStep(idx) {
  const indicators = document.querySelectorAll('.step-indicator');
  indicators.forEach((el,i) => el.classList.toggle('active', i === idx));
  steps.forEach((s,i) => s.classList.toggle('active', i === idx));
  prevBtn.disabled = idx === 0;
  if (idx === steps.length - 1) {
    nextBtn.style.display   = 'none';
    submitBtn.style.display = '';
    buildSummary();
  } else {
    nextBtn.style.display   = '';
    submitBtn.style.display = 'none';
  }
}

function buildSummary() {
  const vals = {
    adults:    form.elements['adults'].value,
    children:  form.elements['children'].value || 0,
    arrival:   form.elements['arrival'].value,
    departure: form.elements['departure'].value,
    name:      form.elements['name'].value,
    email:     form.elements['email'].value,
    phone:     form.elements['phone'].value || '(brak)',
    message:   form.elements['message'].value || '(brak wiadomości)'
  };
  summaryBox.innerHTML = `
    <p><strong>Dorośli:</strong> ${vals.adults}</p>
    <p><strong>Dzieci:</strong> ${vals.children}</p>
    <p><strong>Przyjazd:</strong> ${vals.arrival}</p>
    <p><strong>Wyjazd:</strong> ${vals.departure}</p>
    <hr>
    <p><strong>Imię i nazwisko:</strong> ${vals.name}</p>
    <p><strong>E-mail:</strong> ${vals.email}</p>
    <p><strong>Telefon:</strong> ${vals.phone}</p>
    <hr>
    <p><strong>Wiadomość:</strong><br>${vals.message.replace(/\n/g,'<br>')}</p>
  `;
}

nextBtn.addEventListener('click', () => {
  const inputs = Array.from(steps[currentStep].querySelectorAll('input, textarea'));
  if (inputs.every(i => i.checkValidity())) {
    currentStep++;
    showStep(currentStep);
  } else {
    inputs.forEach(i => i.reportValidity());
  }
});

prevBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

// helper do czyszczenia komunikatu
function clearResponse() {
  responseEl.textContent = '';
  responseEl.classList.remove('success', 'error');
}

form.addEventListener('submit', e => {
  e.preventDefault();
  clearResponse();

  const params = {
    from_name: form.elements['name'].value,
    timestamp: new Date().toLocaleString(),
    adults:    form.elements['adults'].value,
    children:  form.elements['children'].value,
    arrival:   form.elements['arrival'].value,
    departure: form.elements['departure'].value,
    email:     form.elements['email'].value,
    phone:     form.elements['phone'].value || '(brak)',
    message:   form.elements['message'].value
  };

  emailjs.send('service_g6tanel', 'template_nx6uhga', params)
    .then(() => {
      responseEl.textContent = 'Dziękujemy! Twoje zapytanie zostało wysłane.';
      responseEl.classList.add('success');
      setTimeout(() => {
        modal.classList.remove('active');
        form.reset();
        clearResponse();
      }, 3000);
    })
    .catch(err => {
      console.error('EmailJS error:', err);
      responseEl.textContent = 'Wystąpił błąd podczas wysyłki. Spróbuj ponownie później.';
      responseEl.classList.add('error');
    });
});

window.openReservationWizard = () => {
  clearResponse();
  modal.classList.add('active');
  currentStep = 0;
  showStep(0);
};

showStep(0);
