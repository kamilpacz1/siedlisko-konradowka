document.addEventListener('DOMContentLoaded', () => {
    // znajdujemy sekcję z atrybutem data-news-page
    const section = document.querySelector('[data-news-page]');
    if (!section) return;
  
    const pageKey = section.getAttribute('data-news-page');
    const listEl  = document.getElementById('news-list');
    if (!listEl) return;
  
    // relatywna ścieżka do pliku JSON (względem strony HTML)
    const NEWS_JSON_PATH = 'data/news.json';
  
    fetch(NEWS_JSON_PATH)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(allNews => {
        // wybieramy tylko wpisy dla tej strony i sortujemy malejąco po dacie
        const pageNews = allNews
          .filter(item => item.page === pageKey)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
  
        if (pageNews.length === 0) {
          listEl.innerHTML = '<li>Brak aktualności na tę chwilę.</li>';
          return;
        }
  
        // generujemy HTML
        listEl.innerHTML = pageNews.map(item => {
          const date = new Date(item.date).toLocaleDateString('pl-PL', {
            year: 'numeric', month: 'long', day: 'numeric'
          });
          return `
            <li>
              <time datetime="${item.date}">${date}</time>
              <h3>${item.title}</h3>
              <p>${item.summary}</p>
            </li>
          `;
        }).join('');
      })
      .catch(err => {
        console.error('Błąd ładowania aktualności:', err);
        listEl.innerHTML = '<li>Nie udało się pobrać aktualności.</li>';
      });
  });
  