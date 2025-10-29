// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./middleware/logger')
const {errorHandler,notFoundRoute} = require('./middleware/errorHandler')
const projectRoutes = require('./routes/projectRoutes');
const PORT = process.env.PORT || 3000;


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(logger);
const DB_URI = 'mongodb+srv://general:General123@cluster0.cp0grre.mongodb.net/Moongose_ITBA?retryWrites=true&w=majority';

mongoose.connect(DB_URI)
  .then(() => console.log('¡Conectado a MongoDB!'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/api/projects', projectRoutes);



app.use(notFoundRoute);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})