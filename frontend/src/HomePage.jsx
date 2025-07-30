import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioRegistrado from "./componentes/UsuarioRegistrado";
import "./componentes/css/HomePage.css";
import logo from "./componentes/imagenes/logo.png";

const HomePage = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("main-page");
    return () => {
      document.body.classList.remove("main-page");
    };
  }, []);

  const handleStartClick = () => setModalOpen(true);
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
      <main className="homepage-main">
        <h1>
          <img src={logo} alt="LOGO" />
        </h1>
        <h2>Calcula distancias y precios logísticos con un solo clic</h2>
        <p>
          TARLICK es la herramienta definitiva para transportistas, navieras y empresas del sector logístico.
          Introduce tus tarifas y obtén el precio exacto calculando todos los kilómetros necesarios entre puertos y destinos.
        </p>
        <button className="btn-iniciar" onClick={handleStartClick}>
          Comenzar ahora
        </button>
      </main>

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
