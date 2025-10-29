const express = require("express");
const router = express.Router();
const projectController = require('../controllers/projectController');
const validateObjectId = require('../middleware/validateObjectId');

router.post('/', projectController.createProject);         // CREATE
router.get('/', projectController.listProjects);           // LIST
router.get('/:id', validateObjectId, projectController.getProjectById);     // READ
router.patch('/:id', validateObjectId, projectController.updateProject);   // UPDATE
router.delete('/:id', validateObjectId, projectController.deleteProject); // DELETE




module.exports = router;