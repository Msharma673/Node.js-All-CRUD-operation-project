const { DataTypes, sequelize } = require("../lib");

const dish = sequelize.define("dish", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cuisine: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  preparationTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = dish;
