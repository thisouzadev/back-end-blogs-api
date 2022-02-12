const Joi = require('joi');
const User = require('../models');
const errorConstructor = require('../utils/functions/errorHandling');
const {  } = require('../utils/dictionary/statusCode');


const loginUserValidation = async (email, password) => {
  const { error } = schemaLogin.validate(email, password);

  if (error) throw errorConstructor(badRequest, error.message);

  const userFound = await User.findOne({ where: { email, password } });
console.log(userFound);

  if (!userFound || userFound.password !== password) {
    throw errorConstructor(unauthorized, 'Incorrect username or password');
  }

  return userFound;
};

module.exports = {
  loginUserValidation,
};