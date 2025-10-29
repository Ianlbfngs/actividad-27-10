const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la tarea', error: error.message });
  }
};


exports.listTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) {
      filter.project = req.query.project;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }


    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('dependencies', 'title');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar tareas', error: error.message });
  }
};


exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project')
      .populate('assignedTo')
      .populate('dependencies');

    if (!task) {
      return res.status(404).json({ message: `Tarea con id \"${req.params.id}\" no encontrada` });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la tarea', error: error.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: `Tarea con id \"${req.params.id}\" no encontrada` });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la tarea', error: error.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: `Tarea con id \"${req.params.id}\" no encontrada` });
    }
    res.status(200).json({ message: 'Tarea eliminada', tarea: deletedTask });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
  }
};