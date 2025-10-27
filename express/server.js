const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { projectsRouter } = require("./routes/projectsRouter");
const app = express();

const PORT = process.env.PORT || 3000;

const DB_URI = 'mongodb+srv://general:General123@cluster0.cp0grre.mongodb.net/Moongose_ITBA?retryWrites=true&w=majority';


mongoose.connect(DB_URI)
  .then(() => console.log('¡Conexión exitosa a MongoDB!'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use("/api/proyectos", projectsRouter);


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