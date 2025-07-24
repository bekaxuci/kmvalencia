const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Cargar las variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Orígenes permitidos (ajusta según tus URLs)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'https://shiny-disco-699q69vjq7qx34444-5173.app.github.dev',
  'https://shiny-disco-699q69vjq7qx34444-4000.app.github.dev'
];

// Configuración de CORS
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Permite peticiones sin origin (Postman, curl)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `El CORS no permite este origen: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Permite el envío de cookies y autenticación
}));

// Middleware para procesar JSON en el body de la petición
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente.');
});

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
