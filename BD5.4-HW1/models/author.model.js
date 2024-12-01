const { DataTypes, sequelize } = require("../lib");

const author = sequelize.define("author", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthYear: {
    type: DataTypes.INTEGER,
  },
});

module.exports = author;
