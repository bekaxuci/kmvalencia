import React, { useState } from "react";
import "./css/TarifaModalPrecioCerrado.css";

const TarifaModalPrecioCerrado = ({ onClose, puerto, destino, provincia, cp, distancia }) => {
  const [precioCobrarTotal, setPrecioCobrarTotal] = useState("");
  const [precioPagarTotal, setPrecioPagarTotal] = useState("");

  const [tieneRecargo, setTieneRecargo] = useState(false);
  const [porcentajeRecargoCobrar, setPorcentajeRecargoCobrar] = useState("");
  const [porcentajeRecargoPagar, setPorcentajeRecargoPagar] = useState("");

  const [tieneBAF, setTieneBAF] = useState(false);
  const [bafCobrar, setBafCobrar] = useState("");
  const [bafPagar, setBafPagar] = useState("");

  const [resultado, setResultado] = useState(null);

  const calcularTarifa = () => {
    const totalDistancia = parseFloat(distancia) * 2;

    const cobrarTotal = parseFloat(precioCobrarTotal.replace(",", ".")) || 0;
    const pagarTotal = parseFloat(precioPagarTotal.replace(",", ".")) || 0;

    const recargoCobrar = parseFloat(porcentajeRecargoCobrar) || 0;
    const recargoPagar = parseFloat(porcentajeRecargoPagar) || 0;

    const bafCobrarNum = parseFloat(bafCobrar) || 0;
    const bafPagarNum = parseFloat(bafPagar) || 0;

    if (totalDistancia === 0 || isNaN(cobrarTotal) || isNaN(pagarTotal)) {
      setResultado(null);
      return;
    }

    let cobrarFinal = cobrarTotal;
    let pagarFinal = pagarTotal;

    if (tieneRecargo) {
      cobrarFinal *= 1 + recargoCobrar / 100;
      pagarFinal *= 1 + recargoPagar / 100;
    }

    if (tieneBAF) {
      cobrarFinal *= 1 + bafCobrarNum / 100;
      pagarFinal *= 1 + bafPagarNum / 100;
    }

    const cobrarPorKm = cobrarFinal / totalDistancia;
    const pagarPorKm = pagarFinal / totalDistancia;
    const beneficio = cobrarFinal - pagarFinal;

    setResultado({
      cobrarFinal: cobrarFinal.toFixed(2),
      pagarFinal: pagarFinal.toFixed(2),
      cobrarPorKm: cobrarPorKm.toFixed(2),
      pagarPorKm: pagarPorKm.toFixed(2),
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

        <h2 className="modal-title">Precio Cerrado</h2>

        <div className="modal-columns">
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
              <label>Total a cobrar (€):</label>
              <input
                type="number"
                placeholder="Ej: 500"
                value={precioCobrarTotal}
                onChange={(e) => setPrecioCobrarTotal(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="modal-input-group">
              <label>Total a pagar (€):</label>
              <input
                type="number"
                placeholder="Ej: 400"
                value={precioPagarTotal}
                onChange={(e) => setPrecioPagarTotal(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="modal-column">
            <div className="modal-input-group">
              <label>¿Tiene algún recargo?</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="recargo"
                    value="no"
                    checked={!tieneRecargo}
                    onChange={() => setTieneRecargo(false)}
                  /> No
                </label>
                <label>
                  <input
                    type="radio"
                    name="recargo"
                    value="si"
                    checked={tieneRecargo}
                    onChange={() => setTieneRecargo(true)}
                  /> Sí
                </label>
              </div>
            </div>

            {tieneRecargo && (
              <>
                <div className="modal-input-group">
                  <label>Porcentaje recargo a cobrar (%):</label>
                  <input
                    type="number"
                    value={porcentajeRecargoCobrar}
                    onChange={(e) => setPorcentajeRecargoCobrar(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Ej: 5"
                  />
                </div>

                <div className="modal-input-group">
                  <label>Porcentaje recargo a pagar (%):</label>
                  <input
                    type="number"
                    value={porcentajeRecargoPagar}
                    onChange={(e) => setPorcentajeRecargoPagar(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Ej: 5"
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
                    value="no"
                    checked={!tieneBAF}
                    onChange={() => setTieneBAF(false)}
                  /> No
                </label>
                <label>
                  <input
                    type="radio"
                    name="baf"
                    value="si"
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
                    min="0"
                    step="0.01"
                    placeholder="Ej: 3"
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
                    placeholder="Ej: 3"
                  />
                </div>
              </>
            )}

            <button className="button" onClick={calcularTarifa}>
              Calcular tarifa
            </button>

            {resultado && (
              <div className="tarifa-result">
                <p><strong>Total a cobrar:</strong> € {resultado.cobrarFinal}</p>
                <p><strong>Total a pagar:</strong> € {resultado.pagarFinal}</p>
                <p><strong>Cobrar por km:</strong> € {resultado.cobrarPorKm}</p>
                <p><strong>Pagar por km:</strong> € {resultado.pagarPorKm}</p>
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

export default TarifaModalPrecioCerrado;
