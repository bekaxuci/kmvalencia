// src/componentes/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./imagenes/logo.png";
import "./css/Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="homepage-header">
      <img src={logo} alt="Logo Distancias KM" className="logo-header" />
      <nav>
        <button onClick={() => navigate("/login")} className="btn-login">
          Iniciar sesión
        </button>
        <button onClick={() => navigate("/register")} className="btn-register">
          Registrarse
        </button>
      </nav>
    </header>
  );
};

export default Header;
