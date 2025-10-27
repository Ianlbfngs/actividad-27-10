// index.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); 

// URL de conexión (cambia 'tu-base-de-datos' por el nombre que quieras)
const MONGO_URI = 'mongodb+srv://<admin>:<admin>@cluster0.cp0grre.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('¡Conectado a MongoDB!'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});