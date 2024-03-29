const Joi = require('joi');

const { User } = require('../models');
const { createToken } = require('../middlewares/auth');

const errorConstructor = require('../utils/functions/errorHandling');

const {
  success, badRequest, conflict, created, notFound,
} = require('../utils/dictionary/statusCode');

const schemaUser = Joi.object({
  displayName: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().messages({
    'string.min': '"password" length must be 6 characters long',
  }),
  image: Joi.string().required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const createUser = async (req, res, next) => {
  try {
    const { email, password, displayName, image } = req.body;

    const { error } = schemaUser.validate(req.body);
    if (error) throw errorConstructor(badRequest, error.message);
    const findEmail = await User.findOne({ where: { email }, raw: true });
    // raw retorna so os resultados da query sem os meta dados
    if (findEmail) throw errorConstructor(conflict, 'User already registered');

    const newUser = await User.create({ email, password, displayName, image });

    return res.status(created).json(newUser);
  } catch (error) {
    console.log(`POST CREATEUSER -> ${error.message}`);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = schemaLogin.validate(req.body);
    if (error) throw errorConstructor(badRequest, error.message);

    const searchingUser = await User.findOne({ where: { email }, raw: true });

    if (!searchingUser || searchingUser.password !== password) {
      throw errorConstructor(badRequest, 'Invalid fields');
    }

    const token = createToken({ payload: searchingUser });

    return res.status(success).json({ token });
  } catch (error) {
    console.log(`POST LOGIN -> ${error.message}`);
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    delete users.password;
    return res.status(success).json(users);
  } catch (error) {
    console.log(`GET GETALLUSERS -> ${error.message}`);
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const users = await User.findByPk(id);
    if (!users) throw errorConstructor(notFound, 'User does not exist');
    delete users.password;
    return res.status(success).json(users);
  } catch (error) {
    console.log(`GET GETUSERBYID -> ${error.message}`);
    next(error);
  }
};

module.exports = {
  createUser,
  login,
  getAllUsers,
  getUserById,
};
