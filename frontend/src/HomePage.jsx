// src/componentes/HomePage.jsx
import React, { useState } from "react";
import "./componentes/css/HomePage.css";
import { useNavigate } from "react-router-dom";
import UsuarioRegistrado from "./componentes/UsuarioRegistrado";

const HomePage = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleStartClick = () => {
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    navigate("/login");
  };

  const handleCancel = () => {
    setModalOpen(false);
    navigate("/register");
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Distancias Kilométricas</h1>
        <nav>
          {/* Eliminados "Sobre el proyecto" y "Acceso rápido" */}
          <button onClick={() => navigate("/login")} className="btn-login">
            Iniciar sesión
          </button>
          <button onClick={() => navigate("/register")} className="btn-register">
            Registrarse
          </button>
        </nav>
      </header>

      <main className="homepage-main">
        <h2>Calcula distancias logísticas de forma precisa y moderna</h2>
        <p>
          Esta herramienta te permite encontrar la distancia exacta desde los principales puertos españoles hasta cualquier localidad. Ideal para transportistas, navieras y empresas logísticas.
        </p>
        <button className="btn-iniciar" onClick={handleStartClick}>
          Comenzar ahora
        </button>
      </main>

      <footer className="homepage-footer">
        <p>© {new Date().getFullYear()} Distancias KM · Todos los derechos reservados.</p>
      </footer>

      {modalOpen && (
        <UsuarioRegistrado
          message="¿Estás registrado?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default HomePage;
