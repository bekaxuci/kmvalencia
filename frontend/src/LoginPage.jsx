import React from 'react';
import './componentes/css/LoginPage.css';

function LoginPage() {
  return (
    <div className="homepage">
      <main className="homepage-main">
        <h2>Bienvenido de nuevo</h2>
        <p>Ingresa tus credenciales para acceder a tu cuenta.</p>

        <form className="login-form">
          <input type="email" placeholder="Correo electrónico" required />
          <input type="password" placeholder="Contraseña" required />
          <button type="submit" className="btn-iniciar">Iniciar sesión</button>
        </form>
      </main>
    </div>
  );
}

export default LoginPage;
