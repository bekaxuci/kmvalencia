import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "TU_GOOGLE_API_KEY_AQUI";

// Leer allowed origins desde variable de entorno, separar por coma
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman, curl, etc
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS no permitido para el origen: ${origin}`), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight

app.use(express.json());

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
      return res
        .status(500)
        .json({ error: data.status, details: data.error_message });
    }

    const { distance, duration } = data.routes[0].legs.reduce(
      (acc, leg) => {
        acc.distance += leg.distance.value;
        acc.duration += leg.duration.value;
        return acc;
      },
      { distance: 0, duration: 0 }
    );

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

// Servir frontend estático
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
