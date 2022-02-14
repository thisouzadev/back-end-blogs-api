const Joi = require('joi');

const { BlogPost, Categorie } = require('../models');
const errorConstructor = require('../utils/functions/errorHandling');

const {
  created, badRequest,
} = require('../utils/dictionary/statusCode');

const schemaBlogPost = Joi.object({
  title: Joi.string().required(),
  categoryIds: Joi.array().required(),
  content: Joi.string().required(),
});

const findCategoryById = async (id) => {
  const findCategory = await Categorie.findOne({
    where: { id },
  });
  if (!findCategory) {
    throw errorConstructor(400, '"categoryIds" not found');
  }
  return findCategory;
};

console.log(findCategoryById);
const createBlogPost = async (req, res, next) => {
  try {
    const { title, categoryIds, content } = req.body;
    const { error } = schemaBlogPost.validate(req.body);
    if (error) throw errorConstructor(badRequest, error.message);
    const findCategory = await Categorie.findOne({ where: { id: categoryIds } });
    if (!findCategory) {
      throw errorConstructor(400, '"categoryIds" not found');
    }
    const userId = req.user;
    const { dataValues } = await BlogPost.create({ userId, title, content, categoryIds });
    delete dataValues.updated;
    delete dataValues.published;
    return res.status(created).json(dataValues);
  } catch (error) {
    console.log(`POST CREATEBLOGPOST -> ${error.message}`);
    next(error);
  }
};

module.exports = {
  createBlogPost,
};