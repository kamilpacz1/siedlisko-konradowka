// scripts/upcoming.js
document.addEventListener('DOMContentLoaded', () => {
    const root      = document.querySelector('[data-component="upcoming-events"]');
    if (!root) return;
    const listEl    = document.getElementById('upcoming-list');
    const JSON_PATH = 'data/upcoming.json';

    fetch(JSON_PATH)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(events => {
        // czyścimy placeholder
        listEl.innerHTML = '';

        const today = new Date();
        // filtrowanie przyszłych wydarzeń i sortowanie
        const upcoming = events
          .filter(e => new Date(e.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (!upcoming.length) {
          listEl.innerHTML = '<p>Brak nadchodzących wydarzeń.</p>';
          return;
        }

        // 1) Countdown do następnego wydarzenia
        const next   = upcoming[0];
        const diffMs = new Date(next.date) - today;
        const days   = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const d1     = new Date(next.date).toLocaleDateString('pl-PL', {
          day: 'numeric', month: 'long'
        });
        listEl.insertAdjacentHTML('beforeend', `
          <div class="countdown">
            <strong>Już za ${days} dni</strong> [${d1}]: ${next.name}
          </div>
        `);

        // 2) Filtry kategorii
        const categories = [...new Set(upcoming.map(e => e.category || 'Inne'))];
        listEl.insertAdjacentHTML('beforeend', `
          <div class="tag-list">
            <span>Filtruj: </span>
            ${categories.map(cat =>
              `<span class="tag" data-cat="${cat}">${cat}</span>`
            ).join('')}
          </div>
        `);

        // 3) Wyszukiwarka
        listEl.insertAdjacentHTML('beforeend', `
          <div class="search-container">
            <input id="upcoming-search" type="text" placeholder="Szukaj wydarzenia…">
          </div>
        `);

        // 4) Pobieranie ICS
        const icsLines = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Siedlisko//Events//PL'
        ];
        upcoming.forEach(e => {
          const dt = new Date(e.date)
            .toISOString().replace(/[-:]/g, '')
            .split('.')[0] + 'Z';
          icsLines.push(
            'BEGIN:VEVENT',
            `DTSTART:${dt}`,
            `SUMMARY:${e.name}`,
            `DESCRIPTION:${e.description}`,
            `LOCATION:${e.place}`,
            'END:VEVENT'
          );
        });
        icsLines.push('END:VCALENDAR');
        const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar' });
        const url  = URL.createObjectURL(blob);
        listEl.insertAdjacentHTML('beforeend', `
          <div class="ics-download">
            <a href="${url}" download="wydarzenia.ics">
              Dodaj do kalendarza (ICS)
            </a>
          </div>
        `);

        // 5) Grupa według miesiąca
        const grouped = upcoming.reduce((acc, e) => {
          const m = new Date(e.date)
            .toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
          (acc[m] = acc[m] || []).push(e);
          return acc;
        }, {});
        const months = Object.entries(grouped);

        // 6) Generowanie zakładek i paneli
        const savedMonth = localStorage.getItem('upcomingTab') || months[0][0];
        const tabsHtml = months.map(([month]) => `
          <li role="tab"
              tabindex="0"
              aria-selected="${month === savedMonth}"
              id="tab-${month}"
              aria-controls="panel-${month}"
              class="tab${month === savedMonth ? ' active' : ''}"
              data-month="${month}">
            ${month}
          </li>
        `).join('');

        const panelsHtml = months.map(([month, items]) => `
          <div role="tabpanel"
               tabindex="0"
               id="panel-${month}"
               aria-labelledby="tab-${month}"
               class="tab-panel${month === savedMonth ? ' active' : ''}"
               data-month="${month}">
            <div class="event-cards">
              ${items.map(e => {
                const d1 = new Date(e.date).toLocaleDateString('pl-PL', {
                  day: 'numeric', month: 'long', year: 'numeric'
                });
                const d2 = e.endDate
                  ? `– ${new Date(e.endDate).toLocaleDateString('pl-PL', {
                      day: 'numeric', month: 'long'
                    })}`
                  : '';
                const embedUrl = e.map_embed_url
                  ? e.map_embed_url
                  : `https://maps.google.com/maps?q=${encodeURIComponent(e.place)}&z=15&output=embed`;
                const linkUrl = e.map_embed_url
                  ? embedUrl.replace('/embed', '/search')
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.place)}`;
                return `
                  <article class="event-card" data-cat="${e.category}">
                    <div class="date">${d1}${d2}</div>
                    <h4>${e.name}</h4>
                    <div class="place">${e.place}</div>
                    <div class="map-container">
                      <iframe class="mini-map"
                              src="${embedUrl}"
                              loading="lazy"
                              style="border:0">
                      </iframe>
                      <a class="view-map-overlay"
                         href="${linkUrl}"
                         target="_blank" rel="noopener">
                        Wyświetl większą mapę
                      </a>
                    </div>
                    <p>${e.description}</p>
                    <div class="share-buttons">
                      <button class="share-button" data-platform="facebook">🔗</button>
                      <button class="share-button" data-platform="twitter">🐦</button>
                    </div>
                    <a href="${e.url.href}" target="_blank">${e.url.text}</a>
                  </article>
                `;
              }).join('')}
            </div>
          </div>
        `).join('');

        listEl.insertAdjacentHTML('beforeend', `
          <div class="upcoming-tabs">
            <ul class="tab-list" role="tablist">${tabsHtml}</ul>
            <div class="tab-panels">${panelsHtml}</div>
          </div>
        `);

        // 7) Inicjalizacja interakcji
        const tabs   = listEl.querySelectorAll('.tab-list .tab');
        const panels = listEl.querySelectorAll('.tab-panel');
        const cards  = listEl.querySelectorAll('.event-card');
        const tags   = listEl.querySelectorAll('.tag-list .tag');
        const search = document.getElementById('upcoming-search');

        // Nawigacja klawiaturowa w zakładkach
        tabs.forEach((tab, i) => {
          tab.addEventListener('keydown', e => {
            let idx = i;
            if (e.key === 'ArrowRight') idx = (i + 1) % tabs.length;
            if (e.key === 'ArrowLeft')  idx = (i - 1 + tabs.length) % tabs.length;
            tabs[idx].focus();
          });
        });

        // Przełączanie zakładek + zapamiętywanie
        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const month = tab.dataset.month;
            localStorage.setItem('upcomingTab', month);
            tabs.forEach(t => {
              const active = t === tab;
              t.classList.toggle('active', active);
              t.setAttribute('aria-selected', active);
            });
            panels.forEach(p => {
              p.classList.toggle('active', p.dataset.month === month);
            });
          });
        });

        // Filtrowanie po kategoriach
        tags.forEach(tag => {
          tag.addEventListener('click', () => {
            tag.classList.toggle('active');
            const activeCats = [...tags]
              .filter(t => t.classList.contains('active'))
              .map(t => t.dataset.cat);
            cards.forEach(c => {
              c.style.display =
                !activeCats.length || activeCats.includes(c.dataset.cat)
                  ? '' : 'none';
            });
          });
        });

        // Wyszukiwanie live
        search.addEventListener('input', () => {
          const q = search.value.trim().toLowerCase();
          cards.forEach(c => {
            const txt = c.textContent.toLowerCase();
            c.style.display = q && !txt.includes(q) ? 'none' : '';
          });
        });

        // Przyciski share
        listEl.querySelectorAll('.share-button').forEach(btn => {
          btn.addEventListener('click', () => {
            const card  = btn.closest('.event-card');
            const title = card.querySelector('h4').textContent;
            const date  = card.querySelector('.date').textContent;
            const page  = encodeURIComponent(window.location.href);
            if (btn.dataset.platform === 'facebook') {
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${page}&quote=${encodeURIComponent(title + ' ' + date)}`
              );
            } else {
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + ' ' + date + ' ' + window.location.href)}`
              );
            }
          });
        });

        // Fade-in kart przy scrollu
        const io = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        cards.forEach(c => io.observe(c));
      })
      .catch(err => {
        console.error('Błąd ładowania wydarzeń:', err);
        listEl.innerHTML = '<p>Nie udało się pobrać nadchodzących wydarzeń.</p>';
      });
});
