const { DataTypes, sequelize } = require("../lib");

const chef = require("./chef.model");
const dish = require("./dish.model");

const chefDish = sequelize.define("chefDish", {
  chefId: {
    type: DataTypes.INTEGER,
    references: {
      model: chef,
      key: "id",
    },
  },
  dishId: {
    type: DataTypes.INTEGER,
    references: {
      model: dish,
      key: "id",
    },
  },
});

module.exports = chefDish;
