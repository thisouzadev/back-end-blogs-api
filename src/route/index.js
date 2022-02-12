const express = require('express');
const usersController = require('../controllers/usersController');
const { validateToken } = require('../middlewares/auth');

const router = express.Router();

router.post('/user', usersController.createUser);
router.post('/login', usersController.login);
router.get('/user', validateToken, usersController.getAllUsers);
router.get('/user/:id', validateToken, usersController.getUserById);
module.exports = router;