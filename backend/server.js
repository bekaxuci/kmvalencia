// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = "TU_GOOGLE_API_KEY_AQUI";

app.post("/api/ruta", async (req, res) => {
  const { origen, destino, waypoints } = req.body;

  if (!origen || !destino) {
    return res.status(400).json({ error: "origen y destino son requeridos" });
  }

  try {
    const wpParam =
      waypoints && waypoints.length > 0
        ? `&waypoints=${waypoints.map(encodeURIComponent).join("|")}`
        : "";

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      origen
    )}&destination=${encodeURIComponent(destino)}${wpParam}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      return res.status(500).json({ error: data.status, details: data.error_message });
    }

    // Sumar distancia y duración de todos los legs
    const { distance, duration } = data.routes[0].legs.reduce(
      (acc, leg) => {
        acc.distance += leg.distance.value;
        acc.duration += leg.duration.value;
        return acc;
      },
      { distance: 0, duration: 0 }
    );

    // Extraer pasos (instrucciones) de todas las legs
    const pasos = data.routes[0].legs.flatMap((leg) =>
      leg.steps.map((step) => step.html_instructions)
    );

    res.json({
      distanciaKm: (distance / 1000).toFixed(2),
      duracionMin: Math.round(duration / 60),
      pasos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
