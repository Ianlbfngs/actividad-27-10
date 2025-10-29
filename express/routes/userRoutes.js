const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateObjectId = require('../middleware/validateObjectId');


router.post('/', userController.createUser);         // CREATE
router.get('/', userController.listUsers);           // LIST
router.get('/:id', validateObjectId, userController.getUserById);     // READ
router.patch('/:id', validateObjectId, userController.updateUser);   // UPDATE
router.delete('/:id', validateObjectId, userController.deleteUser); // DELETE

module.exports = router;