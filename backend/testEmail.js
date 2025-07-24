require('dotenv').config();
const nodemailer = require('nodemailer');

async function enviarEmailPrueba() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Prueba nodemailer con Gmail',
    text: '¡Hola! Este es un email de prueba desde nodemailer usando contraseña de aplicación.',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.response);
  } catch (error) {
    console.error('Error enviando email:', error);
  }
}

enviarEmailPrueba();
