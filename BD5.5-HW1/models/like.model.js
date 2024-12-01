let { DataTypes, sequelize } = require('../lib');

const user = require('./user.model');
const book = require('./book.model');

const like = sequelize.define('like', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: 'id',
    },
  },
  bookId: {
    type: DataTypes.INTEGER,
    references: {
      model: book,
      key: 'id',
    },
  },
});

module.exports = like;
