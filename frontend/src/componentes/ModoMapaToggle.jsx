// src/componentes/ModoMapaToggle.jsx
import React from "react";
import Switch from "react-switch";

const ModoMapaToggle = ({ modoMapa, setModoMapa }) => {
  return (
    <div
      className="toggle-container"
      style={{
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <label htmlFor="switch-modo-mapa" style={{ fontWeight: "bold" }}>
        {modoMapa ? "Modo Mapa ON" : "Modo Mapa OFF"}
      </label>
      <Switch
        id="switch-modo-mapa"
        onChange={setModoMapa}
        checked={modoMapa}
        onColor="#4caf50"
        offColor="#888"
        uncheckedIcon={false}
        checkedIcon={false}
        height={20}
        width={48}
      />
    </div>
  );
};

export default ModoMapaToggle;
