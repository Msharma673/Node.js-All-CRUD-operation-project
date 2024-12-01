module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Agent", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  });
};
