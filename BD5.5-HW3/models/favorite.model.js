let { DataTypes, sequelize } = require('../lib');

const user = require('./user.model');
const recipe = require('./recipe.model');

const like = sequelize.define('like', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: 'id',
    },
  },
  recipeId: {
    type: DataTypes.INTEGER,
    references: {
      model: recipe,
      key: 'id',
    },
  },
});

module.exports = like;
