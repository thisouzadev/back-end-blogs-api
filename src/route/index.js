const express = require('express');
const usersController = require('../controllers/usersController');
const categoriesController = require('../controllers/categoriesController');
const { validateToken } = require('../middlewares/auth');

const router = express.Router();

router.post('/user', usersController.createUser);
router.post('/login', usersController.login);
router.get('/user', validateToken, usersController.getAllUsers);
router.get('/user/:id', validateToken, usersController.getUserById);

router.post('/categories', validateToken, categoriesController.createCategories);
router.get('/categories', validateToken, categoriesController.getAllCategories);
module.exports = router;
