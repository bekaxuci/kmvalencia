const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  const { nombre, apellidos, email, empresa, password, confirmarPassword } = req.body;

  // Verifica si las contraseñas coinciden
  if (password !== confirmarPassword) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }

  // Verifica si el correo ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'El correo ya está registrado' });
  }

  // Encripta la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guarda el usuario
  const newUser = new User({ nombre, apellidos, email, empresa, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
};
