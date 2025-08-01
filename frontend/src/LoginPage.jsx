import React, { useState } from 'react';
import './componentes/css/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import RecuperarContraseña from './componentes/RecuperarContraseña';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  const navigate = useNavigate();

  // Leer la URL del backend desde variable de entorno
  const API_URL = "https://kmvalencia-rjhnvp1jz-bekas-projects-33b216ec.vercel.app"
  console.log("API_URL:", API_URL); // Mostrar URL base del backend

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    console.log("Enviando datos:", { email, password }); // Mostrar datos enviados

    const url = `${API_URL}/api/auth/login`;
    console.log("URL completa de petición:", url); // Mostrar URL final que se usa en fetch

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log("Respuesta status:", res.status); // Mostrar código HTTP
      const data = await res.json();
      console.log("Respuesta JSON:", data); // Mostrar respuesta JSON

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setMensaje(data.mensaje || "Has iniciado sesión correctamente");
        console.log("Inicio de sesión OK, navegando...");
        navigate("/app");
      } else {
        console.error("Error en login:", data.error || "Error al iniciar sesión");
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error de conexión con el servidor:", err);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="homepage">
      <main className="homepage-main">
        <h2>Bienvenido de nuevo</h2>
        <p>Ingresa tus credenciales para acceder a tu cuenta.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-iniciar">Iniciar sesión</button>

          <p style={{ marginTop: '1rem' }}>
            ¿Olvidaste tu contraseña?{' '}
            <button
              type="button"
              className="link-button"
              onClick={() => setMostrarModal(true)}
            >
              Recupérala aquí
            </button>
          </p>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

        {mostrarModal && (
          <RecuperarContraseña onClose={() => setMostrarModal(false)} />
        )}
      </main>
    </div>
  );
}

export default LoginPage;
