const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); 
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/projects', projectRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);


const MONGO_URI = 'mongodb+srv://<admin>:<admin>@cluster0.cp0grre.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('¡Conectado a MongoDB!'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});