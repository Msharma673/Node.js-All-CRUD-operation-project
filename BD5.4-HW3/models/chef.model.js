const { DataTypes, sequelize } = require("../lib");



const chef = sequelize.define("chef", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = chef;
