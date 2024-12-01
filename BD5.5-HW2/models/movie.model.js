let { DataTypes, sequelize } = require('../lib');

const movie = sequelize.define('movie', {
  title: { type: DataTypes.STRING, allowNull: false },
  director: { type: DataTypes.STRING, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  summary: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = movie;
