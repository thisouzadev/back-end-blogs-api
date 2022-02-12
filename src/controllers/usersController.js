const Joi = require('joi');

const { User } = require('../models');

const errorConstructor = require('../utils/functions/errorHandling');

const { succes, badRequest, unauthorized, conflict } = require('../utils/dictionary/statusCode');

const schemaUser = Joi.object({
  displayName: Joi.string().min(8).required().messages({
    'string.min': '"displayName" length must be at least 8 characters long',
  }),
  email: Joi.string().email().required().messages({
    'any.required': '"email" is required',
    'string.email': '"email" must be a valid email',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': '"password" length must be 6 characters long',
    'any.required': '"password" is required',
  }),
  image: Joi.string().required(),
});

const createUser = async (req, res, next) => {
  try {
    const { email, password, displayName, image } = req.body;

    const { error } = schemaUser.validate(req.body);
    if (error) throw errorConstructor(badRequest, error.message);
    const findEmail = await User.findOne({ where: { email }, raw: true });
    console.log(findEmail, 'email');
    // raw retorna so os resultados da query sem os meta dados
    if (findEmail) throw errorConstructor(conflict, 'User already registered');

    const newUser = await User.create({ email, password, displayName, image });
    
    return res.status(201).json(newUser);
  } catch (error) {
    console.log(`POST CREATEUSER -> ${error.message}`);
    next(error);
  }
};

module.exports = {
  createUser,
};