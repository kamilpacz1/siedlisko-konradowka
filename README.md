# Siedlisko Project (v1.0.0 stable)

Nowoczesna strona rezerwacyjna siedliska Kukowo z podziałem na frontend (folder `client`) oraz backend (folder `server`).

## Wymagania

- **System operacyjny:** Windows 10/11 (lub nowszy)
- **Node.js:** Zainstaluj najnowszą wersję z [nodejs.org](https://nodejs.org/) – instalator dla Windows jest dostępny.
- **Visual Studio Code:** Do edycji kodu (opcjonalnie).

## Struktura projektu

siedlisko-project/ (wersja 1.0.0 stable)
├── client/                  # Frontend
│   ├── index.html           # Główna strona witryny
│   ├── styles/              # Folder ze stylami CSS
│   │   └── main.css         # Główny arkusz stylów
│   ├── scripts/             # Folder ze skryptami JavaScript
│   │   └── main.js          # Główny plik skryptów
│   ├── img/                 # Folder na obrazy (np. hero-fallback.jpg, zdjęcia ofert, galerii)
│   └── videos/              # Folder na pliki wideo (np. hero-video.mp4)
├── server/                  # Backend
│   ├── server.js            # Główny plik serwera Express
│   ├── routes/              # Moduły tras
│   │   └── reservation.js   # Trasa obsługująca rezerwacje
│   ├── controllers/         # Logika kontrolerów
│   │   └── reservationController.js
│   └── config/              # Konfiguracje (np. nodemailer)
│       └── nodemailer-config.js
├── package.json             # Konfiguracja npm i zależności
├── .gitignore               # Plik ignorowany przez Git (np. node_modules/)
└── README.md                # Dokumentacja projektu


## Instalacja i uruchomienie projektu (Windows)

1. **Pobierz projekt:**
   - Sklonuj repozytorium lub pobierz pliki projektu do wybranego folderu na dysku, np. `C:\projekty\siedlisko-project`.

2. **Otwórz projekt w Visual Studio Code:**
   - Uruchom Visual Studio Code i wybierz folder `siedlisko-project`.

3. **Instalacja zależności:**
   - Otwórz **Wiersz poleceń** (Command Prompt) lub **PowerShell** (możesz też korzystać z terminala wbudowanego w VS Code).
   - Przejdź do głównego folderu projektu:
     ```bash
     cd C:\projekty\siedlisko-project
     ```
   - Zainstaluj zależności:
     ```bash
     npm install
     ```

4. **Uruchomienie serwera:**
   - Aby uruchomić serwer w trybie deweloperskim (z automatycznym restartem przy zmianach), użyj:
     ```bash
     npm run dev
     ```
     (Upewnij się, że `nodemon` jest zainstalowany jako zależność developerska.)
   - Alternatywnie, aby uruchomić serwer bez `nodemon`, wpisz:
     ```bash
     npm start
     ```

5. **Otwórz stronę w przeglądarce:**
   - Po uruchomieniu serwera, otwórz przeglądarkę i przejdź do adresu:
     ```
     http://localhost:3000
     ```

## Funkcjonalności

- **Frontend:**  
  - Strona główna zawiera sekcje: Header, Hero (z dynamicznym tłem wideo i fallbackowym obrazem), Oferta, Galeria, Formularz Rezerwacyjny oraz Stopka.
  - Pliki znajdują się w folderze `client/`:
    - `index.html` – struktura strony.
    - `styles/main.css` – nowoczesny, responsywny design.
    - `scripts/main.js` – logika obsługi interakcji, np. wysyłka formularza przez fetch API.
    - Folder `img/` – obrazy, np. fallbackowy obraz dla tła (hero-fallback.jpg) oraz inne zdjęcia.
    - Folder `videos/` – pliki wideo, np. tło wideo (hero-video.mp4).

- **Backend:**  
  - Oparty o Node.js i Express, backend znajduje się w folderze `server/`.
  - Obsługuje endpoint `/api/reservation`, który przyjmuje dane z formularza rezerwacyjnego i wysyła e-mail za pomocą nodemailer.
  - Pliki backend:
    - `server.js` – główny plik serwera.
    - `routes/reservation.js` – trasa dla rezerwacji.
    - `controllers/reservationController.js` – logika walidacji i wysyłki e-maili.
    - `config/nodemailer-config.js` – konfiguracja usługi SMTP dla nodemailer.

## Konfiguracja nodemailer

- Otwórz plik `server/config/nodemailer-config.js` i zaktualizuj ustawienia:
  - `user`: Podaj swój adres e-mail (np. Gmail).
  - `pass`: Podaj swoje hasło lub skonfiguruj OAuth2, aby umożliwić bezpieczną autoryzację.
- W pliku `server/controllers/reservationController.js` zaktualizuj adresy:
  - `from`: Adres nadawcy.
  - `to`: Adres, na który mają trafiać rezerwacje.

## Dalsze kroki

1. **Testowanie:**  
   - Sprawdź działanie strony oraz formularza rezerwacyjnego. Upewnij się, że wideo w sekcji Hero odtwarza się poprawnie, a fallbackowy obraz pojawia się w razie problemów z wideo.
   - Przetestuj wysyłkę formularza – upewnij się, że dane są poprawnie przesyłane do backendu, a e-maile są wysyłane.

2. **Optymalizacja multimediów:**  
   - Upewnij się, że pliki wideo (np. `hero-video.mp4`) i obrazy są zoptymalizowane pod kątem rozmiaru, aby nie wpływały negatywnie na czas ładowania strony.

3. **Rozwój funkcjonalności:**  
   - Rozbuduj sekcję galerii (np. dodając lightbox lub karuzelę zdjęć).
   - Dodaj dodatkowe animacje lub interaktywne efekty, aby zwiększyć zaangażowanie użytkowników.
   - W przyszłości możesz zintegrować projekt z bazą danych oraz dodać panel administracyjny do zarządzania rezerwacjami.
