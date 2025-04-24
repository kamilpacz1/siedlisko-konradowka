// scripts/wizard.js
(function(){
    const form = document.getElementById('wizardForm');
    if (!form) {
      console.warn('Wizard: brak formularza #wizardForm');
      return;
    }
  
    const steps      = Array.from(form.querySelectorAll('.step'));
    const indicators = Array.from(document.querySelectorAll('.step-indicator'));
    const prevBtn    = document.getElementById('prevBtn');
    const nextBtn    = document.getElementById('nextBtn');
    const submitBtn  = document.getElementById('submitBtn');
    let currentStep  = 0;
  
    function showStep(n) {
      steps.forEach((s,i) => s.style.display = i === n ? 'block' : 'none');
      indicators.forEach((ind,i) => ind.classList.toggle('active', i === n));
      prevBtn.disabled = (n === 0);
      nextBtn.style.display   = (n === steps.length - 1 ? 'none' : 'inline-block');
      submitBtn.style.display = (n === steps.length - 1 ? 'inline-block' : 'none');
  
      if (n === steps.length - 1) {
        const sum = form.querySelector('.summary');
        sum.innerHTML = `
          <p><strong>Apartament:</strong> ${document.getElementById('selectedRoomType').value}</p>
          <p><strong>Pobyt:</strong> ${document.getElementById('modalArrival').value} – ${document.getElementById('modalDeparture').value}</p>
          <p><strong>Dorośli:</strong> ${document.getElementById('modalAdults').value}, <strong>Dzieci:</strong> ${document.getElementById('modalChildren').value}, <strong>Zwierzęta:</strong> ${document.getElementById('modalAnimals').value}</p>
          <p><strong>Kontakt:</strong> ${document.getElementById('firstName').value} ${document.getElementById('lastName').value}, tel. ${document.getElementById('phone').value}, email ${document.getElementById('email').value}</p>
        `;
      }
    }
  
    nextBtn.addEventListener('click', () => {
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
  
    showStep(currentStep);
  })();
  