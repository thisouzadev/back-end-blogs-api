module.exports = (sequelize) => {
  const PostsCategorie = sequelize.define('PostsCategories',
    {},
    { timestamps: false, tableName: 'PostsCategories' });

    PostsCategorie.associate = (models) => {
    models.BlogPost.belongsToMany(models.Categorie, {
      as: 'Categories',
      through: PostsCategorie,
      foreignKey: 'postId',
      otherKey: 'categoryId',
    });

    models.Categorie.belongsToMany(models.BlogPost, {
      as: 'BlogPosts',
      through: PostsCategorie,
      foreignKey: 'categoryId',
      otherKey: 'postId',
    });
  };

  return PostsCategorie;
};
