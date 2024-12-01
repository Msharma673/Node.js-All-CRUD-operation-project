let { sequelize } = require('../lib');
const user = require('./user.model');
const book = require('./book.model');
const like = require('./like.model');

user.belongsToMany(book, { through: like });
book.belongsToMany(user, { through: like });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Models synced successfully!');
  })
  .catch((error) => {
    console.error('Error syncing models:', error);
  });

module.exports = { user, book, like };
