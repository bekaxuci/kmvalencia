// frontend/src/componentes/RegisterPage.js
import React, { useState } from 'react';
import './componentes/css/RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    empresa: '',
    password: '',
    confirmarPassword: ''
  });

  const [mensaje, setMensaje] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'; // Variable de entorno para la API

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    console.log(`Campo ${e.target.name} cambiado a:`, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Enviando formulario con datos:', formData);

    if (formData.password !== formData.confirmarPassword) {
      setMensaje('⚠️ Las contraseñas no coinciden');
      console.warn('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      console.log('Respuesta del servidor:', data);

      if (response.ok) {
        setMensaje('🎉 Usuario registrado correctamente');
        setFormData({
          nombre: '',
          apellidos: '',
          email: '',
          empresa: '',
          password: '',
          confirmarPassword: ''
        });
      } else {
        setMensaje(`⚠️ ${data.error || 'Error desconocido'}`);
        console.error('Error de registro:', data.error);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setMensaje('❌ Error de red o servidor.');
    }
  };

  return (
    <div className="homepage">
      <main className="homepage-main">
        <h2>Crea tu cuenta</h2>
        <p>Rellena los campos para registrarte en la plataforma.</p>

        {mensaje && <p style={{ color: 'crimson' }}>{mensaje}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            required
            value={formData.apellidos}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="empresa"
            placeholder="Empresa (opcional)"
            value={formData.empresa}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmarPassword"
            placeholder="Confirmar contraseña"
            required
            value={formData.confirmarPassword}
            onChange={handleChange}
          />
          <button type="submit" className="btn-iniciar">Registrarse</button>
        </form>
      </main>
    </div>
  );
}

export default RegisterPage;
