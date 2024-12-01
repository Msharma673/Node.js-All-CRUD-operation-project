const { sequelize, DataTypes } = require('../lib');

const user = require('./user.model');
const favorite = require('./favorite.model');
const recipe = require('./recipe.model');

user.belongsToMany(recipe, { through: favorite });
recipe.belongsToMany(user, { through: favorite });

// Sync the models with the database
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Models synced successfully!');
  })
  .catch((error) => {
    console.error('Error syncing models:', error);
  });

module.exports = {
  user,
  recipe,
  favorite,
};
