const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const nodemailer = require('nodemailer');

// Verificación de las variables de entorno antes de crear el transportador
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("ERROR: Las variables de entorno EMAIL_USER o EMAIL_PASS no están definidas.");
  process.exit(1); // Terminar la ejecución si las variables no están definidas
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Registro de usuario
exports.registerUser = async (req, res) => {
  const { nombre, apellidos, email, empresa, password, confirmarPassword } = req.body;
  
  try {
    if (password !== confirmarPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nombre, apellidos, email, empresa, password: hashedPassword });

    await newUser.save();
    return res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Login de usuario
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    return res.json({ mensaje: 'Login correcto', user: { nombre: user.nombre, email: user.email } });
  } catch (error) {
    console.error("Error en el login de usuario:", error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Recuperación de contraseña
exports.recuperarContrasena = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El correo es requerido' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'Si el correo existe, te hemos enviado un email.' });
    }

    const token = uuidv4();
    user.recoveryToken = token;
    user.recoveryTokenExpires = Date.now() + 3600000; // Token válido por 1 hora
    await user.save();

    // Usar una URL que cambie según el entorno
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://tu-dominio.com' : 'http://localhost:3000';
    const enlace = `${baseURL}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <p>Hola ${user.nombre},</p>
        <p>Has solicitado recuperar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para restablecerla:</p>
        <a href="${enlace}">${enlace}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Correo de recuperación enviado.' });
  } catch (error) {
    console.error("Error al enviar el correo de recuperación:", error);
    return res.status(500).json({ error: 'Error enviando correo.' });
  }
};

// Resetear la contraseña
exports.resetearContrasena = async (req, res) => {
  const { token, nuevaPassword, confirmarPassword } = req.body;

  if (!token || !nuevaPassword || !confirmarPassword) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  if (nuevaPassword !== confirmarPassword) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }

  try {
    const user = await User.findOne({
      recoveryToken: token,
      recoveryTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    user.password = hashedPassword;
    user.recoveryToken = undefined; // Limpiar token de recuperación
    user.recoveryTokenExpires = undefined; // Limpiar la expiración del token
    await user.save();

    return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
};
