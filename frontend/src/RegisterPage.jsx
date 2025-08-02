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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Mostrar datos antes de enviar la solicitud
      console.log('Enviando datos:', formData);
      
      // URL de la API utilizando la variable de entorno
      const apiUrl = import.meta.env.VITE_API_URL || 'https://kmvalencia.vercel.app/api';
      console.log('URL completa de la solicitud:', `${apiUrl}/auth/register`);

      // Enviar solicitud POST al backend
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // Verificar respuesta del servidor
      const data = await response.json();

      if (response.ok) {
        setMensaje('🎉 Usuario registrado correctamente');
        console.log('Registro exitoso:', data);

        // Limpiar formulario tras registro
        setFormData({
          nombre: '',
          apellidos: '',
          email: '',
          empresa: '',
          password: '',
          confirmarPassword: ''
        });
      } else {
        setMensaje(`⚠️ ${data.error}`);
        console.error('Error en el registro:', data.error);
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
