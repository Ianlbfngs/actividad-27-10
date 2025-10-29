const express = require("express");
const router = express.Router();
const projectController = require('../controllers/projectController');
const mongoose = require('mongoose'); 


const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }
  next();
};


router.post('/', projectController.createProject);         // CREATE
router.get('/', projectController.listProjects);           // LIST
router.get('/:id', validateObjectId, projectController.getProjectById);     // READ
router.patch('/:id', validateObjectId, projectController.updateProject);   // UPDATE
router.delete('/:id', validateObjectId, projectController.deleteProject); // DELETE



/*
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.find()

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error al obtener proyectos:', error.message);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      return next(error);
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error al buscar proyecto por ID:', error.message);
    error.status = 400;
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json({
      mensaje: 'Proyecto creado con exito',
      project: savedProject
    });
  } catch (error) {
    console.error('Error creando el proyecto:', error.message);
    error.status = 400;
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      const error = new Error('Proyecto no encontrado para actualizar');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      mensaje: 'Proyecto actualizado con éxito',
      usuario: updatedProject
    });
  } catch (error) {
    console.error('Error al actualizar proyecto:', error.message);
    error.status = 400;
    next(error);
  }
});


router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      const error = new Error('Proyecto no encontrado para eliminar');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      mensaje: 'Proyecto eliminado con éxito',
      usuario: deleted
    });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error.message);
    error.status = 400; 
    next(error);
  }
});
*/
module.exports = router;