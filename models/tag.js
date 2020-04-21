'use strict';
module.exports = (sequelize, DataTypes) => {
  const tag = sequelize.define('tag', {
    name: DataTypes.STRING
  }, {});
  tag.associate = function(models) {
    // associations can be defined here
    models.tag.belongsToMany(models.article, {
    	through: 'articles_tags',
    	onDelete: 'CASCADE'
    })
  };
  return tag;
};