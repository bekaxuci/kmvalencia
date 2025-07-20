import React from 'react';
import './css/UsuarioRegistrado.css';

export default function UsuarioRegistrado({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn-yes" onClick={onConfirm}>Sí</button>
          <button className="btn-no" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}
