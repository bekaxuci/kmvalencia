const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Obtener allowed origins desde variable de entorno, separadas por coma
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

// Configuración de CORS
app.use(cors({
  origin: function(origin, callback) {
    // Permitir solicitudes sin origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS no permitido para el origen: ${origin}`), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Permitir cookies y autenticación
}));

// Middleware para procesar JSON en las solicitudes
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
