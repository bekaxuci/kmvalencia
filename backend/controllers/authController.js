const User = require('../models/User');
const bcrypt = require('bcryptjs'); // mejor usar bcryptjs, compatible con bcrypt

exports.registerUser = async (req, res) => {
  const { nombre, apellidos, email, empresa, password, confirmarPassword } = req.body;

  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Compara la contraseña con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Aquí podrías agregar la generación de un token JWT para sesiones

    res.json({ mensaje: 'Login correcto', user: { nombre: user.nombre, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
