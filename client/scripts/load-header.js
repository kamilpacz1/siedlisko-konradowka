document.addEventListener('DOMContentLoaded', () => {
  fetch('header.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('header-placeholder').innerHTML = html;
      AOS.refresh();

      // Po załadowaniu headera uruchom sticky header
      initStickyHeader();
    })
    .catch(error => console.error('Błąd ładowania headera:', error));

  function initStickyHeader() {
    const stickyHeader = document.getElementById('stickyHeader');

    if (!stickyHeader) {
      console.warn('Nie znaleziono #stickyHeader');
      return;
    }

    const handleScroll = () => {
      const shouldShow = window.scrollY > 200;
      stickyHeader.classList.toggle('visible', shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
  }
});
