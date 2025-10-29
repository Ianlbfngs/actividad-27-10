const Project = require('../models/project');

exports.createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json({
      mensaje: 'Proyecto creado con exito',
      proyecto: savedProject
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el proyecto', error: error.message });
  }
};

exports.listProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name email')
      .populate('teamMembers.user', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar proyectos', error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('teamMembers.user', 'name email');

    if (!project) {
      return res.status(404).json({ message: `Proyecto con id \"${req.params.id}\" no encontrado` });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el proyecto', error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: `Proyecto con id \"${req.params.id}\" no encontrado` });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el proyecto', error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res.status(404).json({ message: `Proyecto con id \"${req.params.id}\" no encontrado` });
    }


    res.status(200).json({ message: 'Proyecto eliminado', proyecto: deletedProject });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el proyecto', error: error.message });
  }
};