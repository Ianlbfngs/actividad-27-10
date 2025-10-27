const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

//const DB_URI = 'mongodb+srv://<usuario>:<contraseña>@<tu_cluster>.mongodb.net/<nombre_de_tu_base_de_datos>?retryWrites=true&w=majority';

//temporal
const DB_URI = 'mongodb://localhost:27017/local';

mongoose.connect(DB_URI)
  .then(() => console.log('¡Conexión exitosa a MongoDB!'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))




app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});
app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})