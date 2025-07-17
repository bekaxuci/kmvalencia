import React, { useState } from "react";
import "./css/TarifaModalMapa.css";

const TarifaModalMapa = ({ origen, destinos, distancia, onClose }) => {
  const [tarifaKmCobrar, setTarifaKmCobrar] = useState("");
  const [tarifaKmPagar, setTarifaKmPagar] = useState("");

  const [tieneRecargo, setTieneRecargo] = useState(false);
  const [recargoCobrar, setRecargoCobrar] = useState("");
  const [recargoPagar, setRecargoPagar] = useState("");

  const [tieneBAF, setTieneBAF] = useState(false);
  const [bafCobrar, setBafCobrar] = useState("");
  const [bafPagar, setBafPagar] = useState("");

  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const kms = parseFloat(distancia.replace(",", ".")); // cambiar coma por punto

    const tCobrar = parseFloat(tarifaKmCobrar.replace(",", "."));
    const tPagar = parseFloat(tarifaKmPagar.replace(",", "."));

    if (isNaN(kms) || isNaN(tCobrar) || isNaN(tPagar)) {
      alert("Por favor introduce tarifas y distancia válidas.");
      return;
    }

    let baseCobrar = kms * tCobrar;
    let basePagar = kms * tPagar;

    let rCobrar = tieneRecargo ? parseFloat(recargoCobrar.replace(",", ".")) || 0 : 0;
    let rPagar = tieneRecargo ? parseFloat(recargoPagar.replace(",", ".")) || 0 : 0;

    let bCobrar = tieneBAF ? parseFloat(bafCobrar.replace(",", ".")) || 0 : 0;
    let bPagar = tieneBAF ? parseFloat(bafPagar.replace(",", ".")) || 0 : 0;

    const cobrarFinal = baseCobrar * (1 + rCobrar / 100) * (1 + bCobrar / 100);
    const pagarFinal = basePagar * (1 + rPagar / 100) * (1 + bPagar / 100);
    const beneficio = cobrarFinal - pagarFinal;

    setResultado({
      cobrarFinal: cobrarFinal.toFixed(2),
      pagarFinal: pagarFinal.toFixed(2),
      beneficio: beneficio.toFixed(2),
    });
  };

return (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close" onClick={onClose}>×</button>
      <h2 className="modal-title">Detalle Tarifa Ruta</h2>

      <div className="modal-columns">
        {/* COLUMNA IZQUIERDA */}
        <div className="modal-column">
          <div className="modal-input-group">
            <label>Origen:</label>
            <input type="text" value={origen} readOnly />
          </div>

          <div className="modal-input-group">
            <label>Destinos:</label>
            <textarea rows={destinos.length} value={destinos.join("\n")} readOnly />
          </div>

          <div className="modal-input-group">
            <label>Distancia total (km):</label>
            <input type="text" value={distancia} readOnly />
          </div>

          <div className="modal-input-group">
            <label>Tarifa €/km a cobrar:</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={tarifaKmCobrar}
              onChange={(e) => setTarifaKmCobrar(e.target.value)}
            />
          </div>

          <div className="modal-input-group">
            <label>Tarifa €/km a pagar:</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={tarifaKmPagar}
              onChange={(e) => setTarifaKmPagar(e.target.value)}
            />
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="modal-column">
          <div className="modal-input-group">
            <label>¿Tiene recargos?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="recargo"
                  checked={!tieneRecargo}
                  onChange={() => setTieneRecargo(false)}
                /> No
              </label>
              <label>
                <input
                  type="radio"
                  name="recargo"
                  checked={tieneRecargo}
                  onChange={() => setTieneRecargo(true)}
                /> Sí
              </label>
            </div>
          </div>

          {tieneRecargo && (
            <>
              <div className="modal-input-group">
                <label>Recargo a cobrar (%):</label>
                <input
                  type="number"
                  value={recargoCobrar}
                  onChange={(e) => setRecargoCobrar(e.target.value)}
                />
              </div>
              <div className="modal-input-group">
                <label>Recargo a pagar (%):</label>
                <input
                  type="number"
                  value={recargoPagar}
                  onChange={(e) => setRecargoPagar(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="modal-input-group">
            <label>¿Tiene BAF?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="baf"
                  checked={!tieneBAF}
                  onChange={() => setTieneBAF(false)}
                /> No
              </label>
              <label>
                <input
                  type="radio"
                  name="baf"
                  checked={tieneBAF}
                  onChange={() => setTieneBAF(true)}
                /> Sí
              </label>
            </div>
          </div>

          {tieneBAF && (
            <>
              <div className="modal-input-group">
                <label>BAF a cobrar (%):</label>
                <input
                  type="number"
                  value={bafCobrar}
                  onChange={(e) => setBafCobrar(e.target.value)}
                />
              </div>
              <div className="modal-input-group">
                <label>BAF a pagar (%):</label>
                <input
                  type="number"
                  value={bafPagar}
                  onChange={(e) => setBafPagar(e.target.value)}
                />
              </div>
            </>
          )}

          <button className="button" onClick={calcular}>Calcular precio final</button>

          {resultado && (
            <div className="tarifa-result">
              <p><strong>Total a cobrar:</strong> € {resultado.cobrarFinal}</p>
              <p><strong>Total a pagar:</strong> € {resultado.pagarFinal}</p>
              <p style={{ color: resultado.beneficio >= 0 ? "green" : "red", fontWeight: "bold" }}>
                {resultado.beneficio >= 0 ? "Beneficio" : "Pérdida"}: {resultado.beneficio} €
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

};

export default TarifaModalMapa;
