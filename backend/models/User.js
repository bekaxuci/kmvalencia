const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  empresa: { type: String },
  password: { type: String, required: true },
  recoveryToken: { type: String },
  recoveryTokenExpires: { type: Date },
  photoURL: { type: String, default: 'default-image-url.jpg' }, 
});

module.exports = mongoose.model('User', userSchema);
