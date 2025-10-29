const notFoundRoute = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error); // Se lo pasamos a nuestro manejador de errores central
};

const errorHandler = (err, req, res, next) => {
  // Determinamos el código de estado. Si el error no tiene uno, es un 500 (Error Interno del Servidor).
  const statusCode = err.status || 500;

  // Logueamos el error en la consola del servidor para depuración
  console.error(err.message, err.stack);

  // Enviamos una respuesta JSON clara al cliente
  res.status(statusCode).json({
    message: err.message || 'Ha ocurrido un error en el servidor.',
    // Solo mostramos el detalle del error si no estamos en producción
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = {errorHandler,notFoundRoute};