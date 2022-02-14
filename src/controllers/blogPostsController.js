const Joi = require('joi');

const { BlogPost, Categorie, User } = require('../models');
const errorConstructor = require('../utils/functions/errorHandling');

const {
  success, created, badRequest,
} = require('../utils/dictionary/statusCode');

const schemaBlogPost = Joi.object({
  title: Joi.string().required(),
  categoryIds: Joi.array().required(),
  content: Joi.string().required(),
});

const createBlogPost = async (req, res, next) => {
  try {
    const { title, categoryIds, content } = req.body;
    const { error } = schemaBlogPost.validate(req.body);
    if (error) throw errorConstructor(badRequest, error.message);
    // findOne com bug =(
    const findCategory = await Categorie.findOne({ where: { id: categoryIds } });
    if (!findCategory) {
      throw errorConstructor(badRequest, '"categoryIds" not found');
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

const findAllBlogPost = async (req, res, next) => {
  try {
    const allPosts = await BlogPost.findAll({
      include: [
        { model: User, as: 'Users', attributes: { exclude: ['password'] } },
        { model: Categorie, as: 'Categories', through: { attributes: [] } },
      ],
    });
    delete allPosts.PostsCategories;
    return res.status(success).json(allPosts);
  } catch (error) {
    console.log(`GET FINDALLBLOGPOST -> ${error.message}`);
    next(error);
  }
};

module.exports = {
  createBlogPost,
  findAllBlogPost,
};