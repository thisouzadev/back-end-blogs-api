const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.post('/user', usersController.createUser);

module.exports = router;