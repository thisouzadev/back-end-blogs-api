const Joi = require('joi');
const { Categorie } = require('../models');
const errorConstructor = require('../utils/functions/errorHandling');

const {
  success, badRequest, conflict, created, notFound,
} = require('../utils/dictionary/statusCode');

const schemaCategorie = Joi.object({
  name: Joi.string().required(),
});
const createCategories = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { error } = schemaCategorie.validate(req.body);
    if (error) throw errorConstructor(badRequest, error.message);
    const createCategory = await Categorie.create({ name });
    return res.status(created).json(createCategory);
  } catch (error) {
    console.log(`POST CREATECATEGORIE -> ${error.message}`);
    next(error);
  }
};

module.exports = {
  createCategories,
};