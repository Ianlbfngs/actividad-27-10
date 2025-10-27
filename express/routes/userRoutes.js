const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const mongoose = require('mongoose'); 


const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }
  next();
};


router.post('/', userController.createUser);         // CREATE
router.get('/', userController.listUsers);           // LIST
router.get('/:id', validateObjectId, userController.getUserById);     // READ
router.patch('/:id', validateObjectId, userController.updateUser);   // UPDATE
router.delete('/:id', validateObjectId, userController.deleteUser); // DELETE

module.exports = router;