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

  const isHomePage = location.pathname === "/";

  return (
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
      ) : (
        <nav className="not-home-nav">
          <button onClick={() => navigate("/")} className="btn-home">
            Volver al inicio
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
