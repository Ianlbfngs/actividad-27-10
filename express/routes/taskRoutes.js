const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const mongoose = require('mongoose');


const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }
  next();
};


router.post('/', taskController.createTask);         // CREATE
router.get('/', taskController.listTasks);           // LIST
router.get('/:id', validateObjectId, taskController.getTaskById);     // READ
router.patch('/:id', validateObjectId, taskController.updateTask);   // UPDATE
router.delete('/:id', validateObjectId, taskController.deleteTask); // DELETE

module.exports = router;