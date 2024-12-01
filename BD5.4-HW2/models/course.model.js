const { DataTypes, sequelize } = require("../lib");

const course = sequelize.define("course", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = course;
