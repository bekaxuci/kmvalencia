import React, { useState, useEffect, useRef } from "react";
import "./css/MapaConRutas.css";
import TarifaModalMapa from "./TarifaModalMapa";
import SeleccionTarifaModal from "./SeleccionTarifaModal";
import TarifaModalPrecioCerradoMapa from "./TarifaModalPrecioCerradoMapa";

const GOOGLE_MAPS_API_KEY = "AIzaSyA7WUH-f6itwbbNixJSXznp57uDH0bDfSM";

const cargarScript = (url) => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById("googleMaps");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = url;
      script.id = "googleMaps";
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      document.body.appendChild(script);
    } else {
      resolve();
    }
  });
};

const MapaConRutas = () => {
  const [mapa, setMapa] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [origen, setOrigen] = useState("");
  const [destinos, setDestinos] = useState([""]);

  const origenRef = useRef(null);
  const destinoRefs = useRef([]);
  const mapaRef = useRef(null);

  const [resultadoRuta, setResultadoRuta] = useState(null);
  const [tarifa, setTarifa] = useState(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [mostrarModalSeleccionTarifa, setMostrarModalSeleccionTarifa] = useState(false);
  const [mostrarModalPrecioCerrado, setMostrarModalPrecioCerrado] = useState(false); // NUEVO estado modal precio cerrado

  useEffect(() => {
    const iniciarMapa = async () => {
      await cargarScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
      );

      const map = new window.google.maps.Map(mapaRef.current, {
        center: { lat: 40.4168, lng: -3.7038 },
        zoom: 6,
      });

      const renderer = new window.google.maps.DirectionsRenderer({ draggable: true });
      renderer.setMap(map);

      setMapa(map);
      setDirectionsRenderer(renderer);

      renderer.addListener("directions_changed", () => {
        const directions = renderer.getDirections();
        if (!directions) return;

        let distanciaTotalMetros = 0;
        let duracionTotalSegundos = 0;

        directions.routes[0].legs.forEach((leg) => {
          distanciaTotalMetros += leg.distance.value;
          duracionTotalSegundos += leg.duration.value;
        });

        const distanciaKm = (distanciaTotalMetros / 1000).toFixed(2);

        const horas = Math.floor(duracionTotalSegundos / 3600);
        const minutos = Math.round((duracionTotalSegundos % 3600) / 60);
        const duracionFormateada = `${horas > 0 ? horas + " h " : ""}${minutos} min`;

        const duracionCamionSegundos = duracionTotalSegundos * 1.3;
        const horasCamion = Math.floor(duracionCamionSegundos / 3600);
        const minutosCamion = Math.round((duracionCamionSegundos % 3600) / 60);
        const tiempoTarifa = `${horasCamion > 0 ? horasCamion + " h " : ""}${minutosCamion} min`;

        setResultadoRuta({
          distancia: distanciaKm,
          duracion: duracionFormateada,
          tarifaTiempo: tiempoTarifa,
        });

        setTarifa(null);

        const route = directions.routes[0];
        const nuevoOrigen = route.legs[0].start_address;
        const nuevoDestinoFinal = route.legs[route.legs.length - 1].end_address;
        const nuevosWaypoints = route.legs.slice(0, -1).map((leg) => leg.end_address);

        setOrigen(nuevoOrigen);
        setDestinos([...nuevosWaypoints, nuevoDestinoFinal]);
      });

      if (window.google?.maps?.places && origenRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(origenRef.current);
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            setOrigen(place.formatted_address);
          }
        });
      }
    };

    iniciarMapa();
  }, []);

  useEffect(() => {
    if (!window.google?.maps?.places) return;

    destinos.forEach((_, index) => {
      const input = destinoRefs.current[index];
      if (input && !input._autocompleteInitialized) {
        const autocomplete = new window.google.maps.places.Autocomplete(input);
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            const updatedDestinos = [...destinos];
            updatedDestinos[index] = place.formatted_address;
            setDestinos(updatedDestinos);
          }
        });
        input._autocompleteInitialized = true;
      }
    });
  }, [destinos]);

  const handleDestinoChange = (index, value) => {
    const nuevosDestinos = [...destinos];
    nuevosDestinos[index] = value;
    setDestinos(nuevosDestinos);
  };

  const agregarDestino = () => {
    setDestinos([...destinos, ""]);
  };

  const eliminarDestino = (index) => {
    const nuevosDestinos = destinos.filter((_, i) => i !== index);
    setDestinos(nuevosDestinos);
  };

  const calcularRuta = () => {
    if (!origen || destinos.length === 0 || !destinos[destinos.length - 1]) return;

    const directionsService = new window.google.maps.DirectionsService();

    const destinoFinal = destinos[destinos.length - 1];
    const waypoints = destinos
      .slice(0, -1)
      .filter((d) => d.trim() !== "")
      .map((d) => ({
        location: d,
        stopover: true,
      }));

    directionsService.route(
      {
        origin: origen,
        destination: destinoFinal,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);

          let distanciaTotalMetros = 0;
          let duracionTotalSegundos = 0;
          result.routes[0].legs.forEach((leg) => {
            distanciaTotalMetros += leg.distance.value;
            duracionTotalSegundos += leg.duration.value;
          });

          const distanciaKm = (distanciaTotalMetros / 1000).toFixed(2);
          const horas = Math.floor(duracionTotalSegundos / 3600);
          const minutos = Math.round((duracionTotalSegundos % 3600) / 60);
          const duracionFormateada = `${horas > 0 ? horas + " h " : ""}${minutos} min`;

          const duracionCamionSegundos = duracionTotalSegundos * 1.3;
          const horasCamion = Math.floor(duracionCamionSegundos / 3600);
          const minutosCamion = Math.round((duracionCamionSegundos % 3600) / 60);
          const tiempoTarifa = `${horasCamion > 0 ? horasCamion + " h " : ""}${minutosCamion} min`;

          setResultadoRuta({
            distancia: distanciaKm,
            duracion: duracionFormateada,
            tarifaTiempo: tiempoTarifa,
          });

          setTarifa(null);
        } else {
          console.error("Error al calcular la ruta: " + status);
        }
      }
    );
  };

  const manejarSeleccionTarifa = (tipo) => {
    setMostrarModalSeleccionTarifa(false);
    if (tipo === "porKm") {
      const km = parseFloat(resultadoRuta.distancia);
      if (!isNaN(km)) {
        const tarifaCalculada = (km * 0.75).toFixed(2);
        setTarifa(tarifaCalculada);
        setModalAbierto(true);
      }
    } else if (tipo === "precioCerrado") {
      setMostrarModalPrecioCerrado(true); // Abrimos modal precio cerrado
    }
  };

  return (
    <div className="mapa-layout">
      <div className="input-container">
        <h2>Calculadora de Rutas</h2>

        <input
          type="text"
          ref={origenRef}
          placeholder="Origen"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
        />

        {destinos.map((destino, index) => (
          <div
            key={index}
            className={`destino-item ${index < destinos.length - 1 ? "eliminable" : ""}`}
          >
            <input
              type="text"
              ref={(el) => (destinoRefs.current[index] = el)}
              placeholder={index === destinos.length - 1 ? "Destino final" : `Parada ${index + 1}`}
              value={destino}
              onChange={(e) => handleDestinoChange(index, e.target.value)}
            />
            {index < destinos.length - 1 && (
              <button
                type="button"
                className="btn-eliminar"
                onClick={() => eliminarDestino(index)}
              >
                ✕
              </button>
            )}
          </div>
        ))}


        <button onClick={agregarDestino}>+ Añadir destino</button>
        <button onClick={calcularRuta}>Calcular ruta</button>

        {resultadoRuta && (
          <div className="route-info">
            <p><strong>Distancia total:</strong> {resultadoRuta.distancia} km</p>
            <p><strong>Duración 🚗:</strong> {resultadoRuta.duracion}</p>
            <p><strong>Duración 🚚 (80 km/h):</strong> {resultadoRuta.tarifaTiempo}</p>
          </div>
        )}

        {resultadoRuta && (
          <button onClick={() => setMostrarModalSeleccionTarifa(true)}>
            Calcular tarifa
          </button>
        )}
      </div>

      <div ref={mapaRef} id="mapa"></div>

      {mostrarModalSeleccionTarifa && (
        <SeleccionTarifaModal
          onClose={() => setMostrarModalSeleccionTarifa(false)}
          onSeleccion={manejarSeleccionTarifa}
        />
      )}

      {modalAbierto && (
        <TarifaModalMapa
          origen={origen}
          destinos={destinos}
          distancia={resultadoRuta?.distancia || "0.00"}
          tarifaCalculada={tarifa}
          onClose={() => setModalAbierto(false)}
        />
      )}

      {mostrarModalPrecioCerrado && (
        <TarifaModalPrecioCerradoMapa
          origen={origen}
          destinos={destinos}
          distancia={resultadoRuta?.distancia || "0.00"}
          onClose={() => setMostrarModalPrecioCerrado(false)}
        />
      )}
    </div>
  );
};

export default MapaConRutas;
