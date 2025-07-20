import React, { useState, useEffect } from "react";
import ModoMapaToggle from "./componentes/ModoMapaToggle"; // Importa el toggle separado
import MapaConRutas from "./componentes/ModoMapa";
import "./componentes/css/App.css";
import SeleccionTarifaModal from "./componentes/SeleccionTarifaModal"
import TarifaModalPrecioCerrado from "./componentes/TarifaModalPrecioCerrado";


// Datos por puerto
import puertoValencia from "../public/puertovalencia.json";
import puertoAlgeciras from "../public/puertoalgeciras.json";
import puertoBarcelona from "../public/puertobarcelona.json";

import TarifaModal from "./componentes/TarifaModal";

// Asociación de puertos con sus datos
const datosPorPuerto = {
  "Puerto de Valencia": puertoValencia,
  "Puerto de Algeciras": puertoAlgeciras,
  "Puerto de Barcelona": puertoBarcelona,
};

const App = () => {
  const [input, setInput] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [provincia, setProvincia] = useState("");
  const [cp, setCp] = useState("");
  const [selectedPuerto, setSelectedPuerto] = useState("");
  const [localidades, setLocalidades] = useState([]);
  const [showTarifaModal, setShowTarifaModal] = useState(false);
  const [showPreguntaModal, setShowPreguntaModal] = useState(false);
  const [tipoTarifa, setTipoTarifa] = useState(null); // "porKm" o "precioCerrado"


  // Estado para controlar modo mapa / app
  const [modoMapa, setModoMapa] = useState(false);

  // Estado para controlar el índice del slideshow
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (selectedPuerto) {
      setLocalidades(datosPorPuerto[selectedPuerto] || []);
      setInput("");
      setSelectedLocation(null);
      setDistance(null);
      setProvincia("");
      setCp("");
      setFilteredLocations([]);
    }
  }, [selectedPuerto]);

  useEffect(() => {
    if (input.length >= 3) {
      const results = localidades.filter(
        (entry) =>
          entry.poblacion?.toLowerCase().includes(input.toLowerCase()) ||
          entry.cp?.toString().includes(input)
      );
      setFilteredLocations(results);
    } else {
      setFilteredLocations([]);
    }
  }, [input, localidades]);

  // UseEffect para slideshow automático cada 2 segundos solo si NO hay puerto seleccionado
  const handlePuertoChange = (e) => {
    setSelectedPuerto(e.target.value);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setSelectedLocation(null);
    setDistance(null);
    setProvincia("");
    setCp("");
    setFilteredLocations([]);
  };

  const handleSelectLocation = (poblacion, cp) => {
    const selected = localidades.find(
      (e) => e.poblacion === poblacion && e.cp.toString() === cp.toString()
    );

    if (selected) {
      const displayText = `${selected.poblacion} - ${selected.cp}`;
      setInput(displayText);
      setSelectedLocation(displayText);
      setProvincia(selected.provincia);
      setCp(selected.cp);
      setDistance(selected.distancia ?? null);
      setFilteredLocations([]);
    }
  };

  const handleSearch = () => {
    if (!selectedLocation) return;

    const [poblacion, cpStr] = selectedLocation.split(" - ");
    const sel = localidades.find(
      (e) => e.poblacion === poblacion && e.cp.toString() === cpStr
    );

    if (sel) {
      setDistance(sel?.distancia ?? null);
      setProvincia(sel?.provincia ?? "");
      setCp(sel?.cp ?? "");
    }
  };

  return (
    <div className="App">
      {/* Aquí usamos el componente separado para el toggle */}
      <ModoMapaToggle modoMapa={modoMapa} setModoMapa={setModoMapa} />

      {modoMapa ? (
        <div className="map-view" style={{ width: "1500px", height: "800px" }}>
          <MapaConRutas />
        </div>
      ) : (
        <>
          <h1>DISTANCIAS KILOMÉTRICAS</h1>
          <form onSubmit={(e) => e.preventDefault()} className="form-container">
            <select
              value={selectedPuerto}
              onChange={handlePuertoChange}
              className="input"
            >
              <option value="">Selecciona un puerto</option>
              <option value="Puerto de Valencia">Puerto de Valencia</option>
              <option value="Puerto de Algeciras">Puerto de Algeciras</option>
              <option value="Puerto de Barcelona">Puerto de Barcelona</option>
            </select>

            <input
              type="text"
              className="input"
              value={input}
              onChange={handleInputChange}
              placeholder="Busca una localidad"
              autoComplete="off"
              disabled={!selectedPuerto}
            />

            {input.length >= 3 && filteredLocations.length > 0 && (
              <ul className="suggestions">
                {filteredLocations.map((e, i) => (
                  <li
                    key={`${e.poblacion}-${e.cp}-${i}`}
                    onClick={() => handleSelectLocation(e.poblacion, e.cp)}
                    className="suggestion-item"
                  >
                    <span className="localidad">
                      {e.poblacion} - {e.cp}, {e.provincia}
                    </span>
                    <span className="kms">{e.distancia} km</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              className="button"
              onClick={handleSearch}
              disabled={!selectedLocation}
            >
              Buscar
            </button>
          </form>

          {distance !== null && selectedLocation && (
            <div className="result">
              <p>
                Hasta <strong>{selectedLocation}</strong> ({provincia})
              </p>
              <div className="distance-highlight">
                <strong>{distance} KM</strong>
              </div>
              <button
                type="button"
                className="button"
                onClick={() => setShowPreguntaModal(true)}
              >
                Calcula tu tarifa
              </button>

              {/* Modal de selección de tipo de tarifa */}
              {showPreguntaModal && (
                <SeleccionTarifaModal
                  onClose={() => setShowPreguntaModal(false)}
                  onSeleccion={(tipo) => {
                    if (tipo === "porKm") {
                      setTipoTarifa("porKm");
                      setShowPreguntaModal(false);
                      setShowTarifaModal(true);
                    } else if (tipo === "precioCerrado") {
                      setTipoTarifa("precioCerrado");
                      setShowPreguntaModal(false);
                      setShowTarifaModal(true);
                    }
                  }}
                />
              )}

              {/* Solo se abre si se eligió "porKm" */}
              {showTarifaModal && tipoTarifa === "porKm" && (
                <TarifaModal
                  onClose={() => setShowTarifaModal(false)}
                  puerto={selectedPuerto}
                  destino={selectedLocation}
                  provincia={provincia}
                  cp={cp}
                  distancia={distance}
                />
              )}
              {showTarifaModal && tipoTarifa === "precioCerrado" && (
                <TarifaModalPrecioCerrado
                  onClose={() => setShowTarifaModal(false)}
                  puerto={selectedPuerto}
                  destino={selectedLocation}
                  provincia={provincia}
                  cp={cp}
                  distancia={distance}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
