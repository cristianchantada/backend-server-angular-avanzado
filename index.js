require('dotenv').config();

const express = require('express');
const { dbConnection } = require('./database/config')
const cors = require('cors');

// Crear el servidor de express
const app = express();

// CORS
app.use(cors());

// Base de datos
dbConnection();

// Rutas
app.get('/', (req, res) => {
    res.status(400).json({
      ok: true,
      msg: 'Hola Mundo !'
    })
});

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto', process.env.PORT);
});
