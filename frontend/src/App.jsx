import React, { useState, useEffect } from "react";
import ModoMapaToggle from "./componentes/ModoMapaToggle"; // Importa el toggle separado
import MapaConRutas from "./componentes/ModoMapa"
import "./App.css";

// Imágenes de los puertos
import puertoValenciaImg from "./componentes/PUERTODEVALENCIA.png";
import puertoAlgecirasImg from "./componentes/PUERTODEALGECIRAS.png";
import puertoBarcelonaImg from "./componentes/PUERTODEBARCELONA.png";

// Otras imágenes
import camionImg from "./componentes/camion.png";
import carreteraImg from "./componentes/carretera.png";
import destinoImg from "./componentes/destino.png";

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

// Asociación de puertos con sus imágenes
const imagenesPorPuerto = {
  "Puerto de Valencia": puertoValenciaImg,
  "Puerto de Algeciras": puertoAlgecirasImg,
  "Puerto de Barcelona": puertoBarcelonaImg,
};

// Array con las imágenes para slideshow
const slideshowImages = [
  { name: "Puerto de Valencia", img: puertoValenciaImg },
  { name: "Puerto de Algeciras", img: puertoAlgecirasImg },
  { name: "Puerto de Barcelona", img: puertoBarcelonaImg },
];

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
  useEffect(() => {
    if (selectedPuerto) return; // No hacer slideshow si hay puerto seleccionado

    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedPuerto]);

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
        <div className="map-view" style={{ width: "1500PX", height: "800px" }}>
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
                onClick={() => setShowTarifaModal(true)}
              >
                Calcula tu tarifa
              </button>
              {showTarifaModal && (
                <TarifaModal
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

          <div className="map-content">
            <div className="map-item puerto">
              {/* Aquí muestra el slideshow si NO hay puerto seleccionado */}
              {!selectedPuerto ? (
                <img
                  src={slideshowImages[slideIndex].img}
                  alt={slideshowImages[slideIndex].name}
                  className="puerto-img"
                  style={{ borderRadius: "20px", width: "100%", maxWidth: "400px" }}
                />
              ) : (
                <img
                  src={imagenesPorPuerto[selectedPuerto]}
                  alt={selectedPuerto}
                  className="puerto-img"
                />
              )}
            </div>

            {distance !== null && selectedLocation && (
              <div className="map-item marker">
                <div className="marker-emoji">
                  <img src={destinoImg} alt="Ubicación" />
                </div>
                <div className="marker-arrow" />
              </div>
            )}
          </div>
        </>
      )}
      <footer>
        <div
            className="map-container"
            style={{ backgroundImage: `url(${carreteraImg})` }}
          >
            {distance !== null && selectedLocation && (
              <div
                className="map-item camion"
                style={{
                  animationDuration: `${Math.min(Math.max(distance / 20, 6), 10)}s`,
                }}
              >
                <img src={camionImg} alt="Camión" className="camion-img" />
              </div>
            )}
          </div>
      </footer>
    </div>
  );
};

export default App;
