const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateObjectId = require('../middleware/validateObjectId');


router.post('/', taskController.createTask);         // CREATE
router.get('/', taskController.listTasks);           // LIST
router.get('/:id', validateObjectId, taskController.getTaskById);     // READ
router.patch('/:id', validateObjectId, taskController.updateTask);   // UPDATE
router.delete('/:id', validateObjectId, taskController.deleteTask); // DELETE

module.exports = router;