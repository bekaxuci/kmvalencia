import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./imagenes/logo.png";
import "./css/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Para almacenar los datos del usuario
  const [isHome, setIsHome] = useState(true); // Para manejar la página de inicio

  // Verificación del localStorage y actualización del estado
  useEffect(() => {
    // Verificar si hay un token de sesión almacenado en el localStorage (esto puede variar según tu implementación de autenticación)
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData); // Establecer el usuario desde el localStorage
      setIsHome(false); // Cambiar la vista si el usuario está autenticado
    }
  }, []); // Ejecutar solo al cargar el componente

  const handleLogoClick = () => {
    navigate("/"); // Navegar a la página principal
  };

  const handleLogout = () => {
    // Limpiar el estado del usuario y redirigir a la página de inicio
    localStorage.removeItem("user"); // Borrar el usuario del localStorage
    setUser(null); // Limpiar el estado del usuario
    setIsHome(true); // Volver a la vista inicial
    navigate("/"); // Redirigir a la página de inicio
  };

  return (
    <header className="homepage-header">
      {/* Logo que redirige a la página principal */}
      <button onClick={handleLogoClick} className="logo-button">
        <img src={logo} alt="Logo Distancias KM" className="logo-header" />
      </button>

      <nav>
        {/* Si hay usuario autenticado, mostrar su foto y nombre */}
        {user ? (
          <div className="user-info">
            <img src={user.photoURL || 'https://example.com/default-photo.jpg'} alt="User Avatar" className="user-photo" />
            <span className="user-name">{user.nombre}</span>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar sesión
            </button>
          </div>
        ) : (
          // Si no hay usuario, mostrar botones de login y registro
          <>
            <button onClick={() => navigate("/login")} className="btn-login">
              Iniciar sesión
            </button>
            <button onClick={() => navigate("/register")} className="btn-register">
              Registrarse
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
