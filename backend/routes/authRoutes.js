const express = require('express');
const {
  registerUser,
  loginUser,
  recuperarContrasena,
  resetearContrasena
} = require('../controllers/authController');

const router = express.Router();

// Ruta para el registro de un nuevo usuario
router.post('/register', registerUser);

// Ruta para login de usuario
router.post('/login', loginUser);

// Ruta para recuperar la contraseña
router.post('/recuperar', recuperarContrasena);

// Ruta para resetear la contraseña
router.post('/resetear', resetearContrasena);

module.exports = router;
