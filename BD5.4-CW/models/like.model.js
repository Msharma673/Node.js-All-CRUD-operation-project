let { DataTypes, sequelize } = require("../lib");

const user = require("./user.model");
const track = require("./track.model");

const like = sequelize.define("like", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: "id",
    },
  },
  trackId: {
    type: DataTypes.INTEGER,
    references: {
      model: track,
      key: "id",
    },
  },
});

module.exports = like;
