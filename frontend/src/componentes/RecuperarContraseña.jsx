import React, { useState } from 'react';
import './css/RecuperarContraseña.css';

const RecuperarContraseña = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://shiny-disco-699q69vjq7qx34444-4000.app.github.dev/api/auth/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      console.log('Respuesta backend:', data);
      if (!res.ok) {
        setError(data.error || 'Error al enviar el correo');
      } else {
        setMensaje('Te hemos enviado un correo con instrucciones.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Recuperar contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default RecuperarContraseña;
