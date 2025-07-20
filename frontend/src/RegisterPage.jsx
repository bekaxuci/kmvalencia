import React from 'react';
import './componentes/css/RegisterPage.css';

function RegisterPage() {
    return (
        <div className="homepage">

            <main className="homepage-main">
                <h2>Crea tu cuenta</h2>
                <p>Rellena los campos para registrarte en la plataforma.</p>
                <form className="register-form">
                    <input type="text" placeholder="Nombre" name="nombre" required />
                    <input type="text" placeholder="Apellidos" name="apellidos" required />
                    <input type="email" placeholder="Correo electrónico" name="email" required />
                    <input type="text" placeholder="Empresa (opcional)" name="empresa" />
                    <input type="password" placeholder="Contraseña" name="password" required />
                    <input type="password" placeholder="Confirmar contraseña" name="confirmarPassword" required />
                    <button type="submit" className="btn-iniciar">Registrarse</button>
                </form>
            </main>
        </div>
    );
}

export default RegisterPage;
