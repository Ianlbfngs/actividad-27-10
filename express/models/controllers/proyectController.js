const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body); 
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el proyecto', error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el proyecto', error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } 
    );

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el proyecto', error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }


    res.status(200).json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el proyecto', error: error.message });
  }
};