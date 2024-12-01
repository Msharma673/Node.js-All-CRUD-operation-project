const { sequelize } = require("../lib");

const user = require("./user.model");
const track = require("./track.model");
const like = require("./like.model");

user.belongsToMany(track, { through: like });
track.belongsToMany(user, { through: like });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Models synced successfully!");
  })
  .catch((error) => {
    console.error("Error syncing models:", error);
  });

module.exports = {
  user,
  track,
  like,
};
