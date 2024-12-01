module.exports = (sequelize, DataTypes) => {
  return sequelize.define("role", {
    title: DataTypes.STRING,
  });
};
