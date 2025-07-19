import React from "react";
import "./css/SeleccionTarifaModal.css"; 

const SeleccionTarifaModal = ({ onClose, onSeleccion }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>¿CÓMO QUIERES CALCULAR TU TARIFA?</h2>
        <div className="options">
          <button
            className="button"
            onClick={() => onSeleccion("porKm")}
          >
            POR KM / €
          </button>
          <button
            className="button"
            onClick={() => onSeleccion("precioCerrado")}
          >
            PRECIO CERRADO
          </button>
        </div>
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default SeleccionTarifaModal;
