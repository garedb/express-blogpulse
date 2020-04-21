'use strict';
module.exports = (sequelize, DataTypes) => {
  const articles_tags = sequelize.define('articles_tags', {
    articleId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {});
  articles_tags.associate = function(models) {
    // associations can be defined here
  };
  return articles_tags;
};