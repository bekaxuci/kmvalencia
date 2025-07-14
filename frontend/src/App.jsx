import React, { useState, useEffect } from "react";
import "./App.css";
import datosJSON from "../../backend/puertovalencia.json";
import puertoImg from "./componentes/PUERTODEVALENCIA.png";
import camionImg from "./componentes/camion.png";
import carreteraImg from "./componentes/carretera.png";

const App = () => {
  const [input, setInput] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [distance, setDistance] = useState(null);
  const [provincia, setProvincia] = useState("");
  const [cp, setCp] = useState("");

  useEffect(() => {
    if (input.length >= 3) {
      const results = datosJSON.filter((entry) =>
        entry.poblacion?.toLowerCase().includes(input.toLowerCase()) ||
        entry.cp?.toString().includes(input)
      );
      setFilteredLocations(results);
    } else {
      setFilteredLocations([]);
    }
  }, [input]);

  useEffect(() => {
    if (selectedLocation) {
      const sel = datosJSON.find((e) => e.poblacion === selectedLocation);
      setDistance(sel?.km ?? null);
      setProvincia(sel?.provincia ?? "");
      setCp(sel?.cp ?? "");
      setInput(selectedLocation);
      setFilteredLocations([]);
    }
  }, [selectedLocation]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setSelectedLocation("");
    setDistance(null);
    setProvincia("");
    setCp("");
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
  };

  const handleSearch = () => {
    if (selectedLocation) {
      const sel = datosJSON.find((e) => e.poblacion === selectedLocation);
      setDistance(sel?.km ?? null);
      setProvincia(sel?.provincia ?? "");
      setCp(sel?.cp ?? "");
    }
  };

  return (
    <div className="App">
      <h1>DISTANCIAS KILOMÉTRICAS</h1>
      <form onSubmit={(e) => e.preventDefault()} className="form-container">
        <input
          type="text"
          className="input"
          value={input}
          onChange={handleInputChange}
          placeholder="Busca una localidad"
          autoComplete="off"
        />
        {input.length >= 3 && filteredLocations.length > 0 && (
          <ul className="suggestions">
            {filteredLocations.map((e, i) => (
              <li
                key={i}
                onClick={() => handleSelectLocation(e.poblacion)}
                className="suggestion-item"
              >
                <span className="localidad">
                  {e.poblacion} - {e.cp}, {e.provincia}
                </span>
                <span className="kms">{e.km} km</span>
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
          <h2>Resultado de búsqueda</h2>
          <p>
            Hasta <strong>{selectedLocation}</strong> ({provincia}, CP: {cp}) son{" "}
            <strong>{distance} km</strong>.
          </p>
        </div>
      )}

      <div className="map-content">
        {/* Puerto */}
        <div className="map-item puerto">
          <img src={puertoImg} alt="Puerto de Valencia" className="puerto-img" />
        </div>

        {/* Ubicación */}
        {distance !== null && selectedLocation && (
          <div className="map-item marker">
            <div className="marker-emoji" role="img" aria-label="ubicación">📌</div>
            <span className="marker-text">
              {selectedLocation} {distance}km
            </span>
            <div className="marker-arrow" />
          </div>
        )}
      </div>

      <div
        className="map-container"
        style={{ backgroundImage: `url(${carreteraImg})` }}
      >
        {/* Camión */}
        {distance !== null && selectedLocation && (
          <div
            className="map-item camion"
            style={{ animationDuration: `${Math.min(Math.max(distance / 20, 6), 10)}s` }}
          >
            <img src={camionImg} alt="Camión" className="camion-img" />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
