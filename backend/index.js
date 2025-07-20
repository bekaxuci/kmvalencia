const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();      
connectDB();          

const app = express();

// Orígenes permitidos (ajusta según tus URLs)
const allowedOrigins = [
  'http://localhost:3000', // React local (puerto típico)
  'http://localhost:4000', // Si usas otro puerto local
  'https://shiny-disco-699q69vjq7qx34444-5173.app.github.dev',  // Frontend Codespaces
  'https://shiny-disco-699q69vjq7qx34444-4000.app.github.dev'   // Backend Codespaces (a veces necesario para preflight)
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Permite peticiones como Postman o curl sin origin
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `El CORS no permite este origen: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json()); // Para parsear JSON en el body

app.use('/api/auth', authRoutes); // Rutas de autenticación

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente.');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

