const { DataTypes, sequelize } = require("../lib");

const book = sequelize.define("book", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
  },
  publicationYear: {
    type: DataTypes.INTEGER,
  },
});

module.exports = book;
