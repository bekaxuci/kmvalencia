const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();      // Carga las variables de .env
connectDB();          // Conecta a MongoDB

const app = express();
app.use(cors({
  origin: 'https://shiny-disco-699q69vjq7qx34444-5173.app.github.dev',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json()); // Permite leer JSON en el body

app.use('/api/auth', authRoutes); // Ruta para registro

app.listen(process.env.PORT || 4000, () => {
  console.log('Servidor corriendo');
});

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente.');
});
