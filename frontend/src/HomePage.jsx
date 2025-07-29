import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioRegistrado from "./componentes/UsuarioRegistrado";
import logo from "./componentes/imagenes/logo.png";
import "./componentes/css/HomePage.css";
import Header from "./componentes/Header";

const HomePage = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Cuando el componente se monte, agregamos la clase 'main-page' al body
    document.body.classList.add("main-page");

    // Limpiamos la clase cuando el componente se desmonte
    return () => {
      document.body.classList.remove("main-page");
    };
  }, []);

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
