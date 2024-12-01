const { sequelize } = require("../lib");
const chef = require("./chef.model");
const dish = require("./dish.model");
const chefDish = require("./chefDish.model");

chef.belongsToMany(dish, { through: chefDish });
dish.belongsToMany(chef, { through: chefDish });

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((error) => console.error("Error syncing database:", error));

module.exports = { chef, dish, chefDish };
