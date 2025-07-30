import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "./imagenes/logo.png";
import "./css/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const currentPath = location.pathname;
  const isHomePage = currentPath === "/";
  const isAppPage = currentPath === "/app";

  // Contenido del header
  const headerContent = (
    <header className={`homepage-header ${isHomePage ? "home" : "not-home"}`}>
      <button onClick={handleLogoClick} className="logo-button">
        <img src={logo} alt="Logo Distancias KM" className="logo-header" />
      </button>

      {isHomePage ? (
        <div className="buttonsLoginRegister">
          <button onClick={() => navigate("/login")} className="btn-login">
            Iniciar sesión
          </button>
          <button onClick={() => navigate("/register")} className="btn-register">
            Registrarse
          </button>
        </div>
      ) : isAppPage ? (
        <nav className="not-home-nav">
          <button onClick={handleLogout} className="btn-logout">
            Cerrar sesión
          </button>
        </nav>
      ) : null}
    </header>
  );

  return isAppPage ? (
    <div className="header-container">{headerContent}</div>
  ) : (
    headerContent
  );
};

export default Header;
