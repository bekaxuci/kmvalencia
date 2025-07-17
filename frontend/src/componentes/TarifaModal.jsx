import React, { useState } from "react";
import "../componentes/css/TarifaModal.css";

const TarifaModal = ({ onClose, puerto, destino, provincia, cp, distancia }) => {
  const [precioCobrarKm, setPrecioCobrarKm] = useState("");
  const [precioPagarKm, setPrecioPagarKm] = useState("");

  const [tieneRecargo, setTieneRecargo] = useState(false);
  const [porcentajeRecargoCobrar, setPorcentajeRecargoCobrar] = useState("");
  const [porcentajeRecargoPagar, setPorcentajeRecargoPagar] = useState("");

  const [tieneBAF, setTieneBAF] = useState(false);
  const [bafCobrar, setBafCobrar] = useState("");
  const [bafPagar, setBafPagar] = useState("");

  // Estado único para resultados
  const [resultado, setResultado] = useState(null);

  const calcularTarifa = () => {
    const cobrarKm = parseFloat(precioCobrarKm.replace(",", ".")) || 0;
    const pagarKm = parseFloat(precioPagarKm.replace(",", ".")) || 0;
    const kms = parseFloat(distancia) * 2;

    const recargoCobrar = parseFloat(porcentajeRecargoCobrar) || 0;
    const recargoPagar = parseFloat(porcentajeRecargoPagar) || 0;

    const bafCobrarNum = parseFloat(bafCobrar) || 0;
    const bafPagarNum = parseFloat(bafPagar) || 0;

    if (isNaN(cobrarKm) || isNaN(pagarKm) || isNaN(kms)) {
      setResultado(null);
      return;
    }

    let totalCobrar = cobrarKm * kms;
    if (tieneRecargo) totalCobrar *= 1 + recargoCobrar / 100;
    if (tieneBAF) totalCobrar *= 1 + bafCobrarNum / 100;

    let totalPagar = pagarKm * kms;
    if (tieneRecargo) totalPagar *= 1 + recargoPagar / 100;
    if (tieneBAF) totalPagar *= 1 + bafPagarNum / 100;

    const beneficio = totalCobrar - totalPagar;

    setResultado({
      cobrarFinal: totalCobrar.toFixed(2),
      pagarFinal: totalPagar.toFixed(2),
      beneficio: beneficio.toFixed(2),
    });
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}
    >
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>

        <h2 className="modal-title">Calcula tu tarifa</h2>

        <div className="modal-columns">
          {/* Columna izquierda */}
          <div className="modal-column">
            <div className="modal-input-group">
              <label>Puerto de salida:</label>
              <input type="text" value={puerto} readOnly />
            </div>

            <div className="modal-input-group">
              <label>Destino:</label>
              <input type="text" value={`${destino} (${provincia})`} readOnly />
            </div>

            <div className="modal-input-group">
              <label>Distancia ida y vuelta (KM):</label>
              <input type="text" value={parseFloat(distancia) * 2} readOnly />
            </div>

            <div className="modal-input-group">
              <label>Precio a cobrar por km (€):</label>
              <input
                type="number"
                placeholder="Introduce precio a cobrar €/km"
                value={precioCobrarKm}
                onChange={(e) => setPrecioCobrarKm(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>

            <div className="modal-input-group">
              <label>Precio a pagar por km (€):</label>
              <input
                type="number"
                placeholder="Introduce precio a pagar €/km"
                value={precioPagarKm}
                onChange={(e) => setPrecioPagarKm(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="modal-column">
            <div className="modal-input-group">
              <label>¿Tiene algún recargo (sobrepeso, festivo, etc.)?</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="recargo"
                    value="no"
                    checked={!tieneRecargo}
                    onChange={() => setTieneRecargo(false)}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="radio"
                    name="recargo"
                    value="si"
                    checked={tieneRecargo}
                    onChange={() => setTieneRecargo(true)}
                  />{" "}
                  Sí
                </label>
              </div>
            </div>

            {tieneRecargo && (
              <>
                <div className="modal-input-group">
                  <label>Porcentaje de recargo a cobrar (%):</label>
                  <input
                    type="number"
                    value={porcentajeRecargoCobrar}
                    onChange={(e) => setPorcentajeRecargoCobrar(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Introduce % recargo a cobrar"
                  />
                </div>

                <div className="modal-input-group">
                  <label>Porcentaje de recargo a pagar (%):</label>
                  <input
                    type="number"
                    value={porcentajeRecargoPagar}
                    onChange={(e) => setPorcentajeRecargoPagar(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Introduce % recargo a pagar"
                  />
                </div>
              </>
            )}

            <div className="modal-input-group">
              <label>¿Tiene BAF (cargo adicional)?</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="baf"
                    value="no"
                    checked={!tieneBAF}
                    onChange={() => setTieneBAF(false)}
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="radio"
                    name="baf"
                    value="si"
                    checked={tieneBAF}
                    onChange={() => setTieneBAF(true)}
                  />{" "}
                  Sí
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
                    min="0"
                    step="0.01"
                    placeholder="Introduce % BAF a cobrar"
                  />
                </div>
                <div className="modal-input-group">
                  <label>BAF a pagar (%):</label>
                  <input
                    type="number"
                    value={bafPagar}
                    onChange={(e) => setBafPagar(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Introduce % BAF a pagar"
                  />
                </div>
              </>
            )}

            <button className="button" onClick={calcularTarifa}>
              Calcular tarifa
            </button>

            {/* Resultado */}
            {resultado && (
              <div className="tarifa-result">
                <p><strong>Total a cobrar:</strong> € {resultado.cobrarFinal}</p>
                <p><strong>Total a pagar:</strong> € {resultado.pagarFinal}</p>
                <p
                  style={{
                    color: resultado.beneficio >= 0 ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
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

export default TarifaModal;
