const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(require('../config/nodemailer-config'));

exports.handleReservation = async (req, res) => {
  const { name, email, date, guests, message } = req.body;
  
  // Prosta walidacja
  if (!name || !email || !date || !guests) {
    return res.status(400).json({ message: 'Uzupełnij wymagane pola.' });
  }

  const mailOptions = {
    from: 'twojemail@example.com',       // Zmień na swój adres nadawcy
    to: 'odbiorca@example.com',            // Zmień na adres, na który mają trafiać rezerwacje
    subject: 'Nowa rezerwacja - Kukowo',
    text: `Dane rezerwacji:\nImię i nazwisko: ${name}\nEmail: ${email}\nData: ${date}\nLiczba gości: ${guests}\nUwagi: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Rezerwacja wysłana pomyślnie.' });
  } catch (error) {
    console.error('Błąd wysyłki maila:', error);
    res.status(500).json({ message: 'Wystąpił problem podczas wysyłki rezerwacji.' });
  }
};
