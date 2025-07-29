import React, { useState } from 'react';
import './componentes/css/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import RecuperarContraseña from './componentes/RecuperarContraseña';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para mostrar modal

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const res = await fetch('https://shiny-disco-699q69vjq7qx34444-4000.app.github.dev/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // Supongamos que tu backend responde con "user" en el JSON
        localStorage.setItem("user", JSON.stringify(data.user));
        setMensaje(data.mensaje || "Has iniciado sesión correctamente");
        navigate("/app");
      } else {
        setError(data.error || "Error al iniciar sesión");
      }

    } catch (err) {
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

        {/* Mostrar modal solo si mostrarModal es true */}
        {mostrarModal && (
          <RecuperarContraseña onClose={() => setMostrarModal(false)} />
        )}
      </main>
    </div>
  );
}

export default LoginPage;
