let { DataTypes, sequelize } = require('../lib');

const user = require('./user.model');
const movie = require('./movie.model');
const like = require('./like.model');

user.belongsToMany(movie, { through: like });
movie.belongsToMany(user, { through: like });

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
  movie,
  like,
};
