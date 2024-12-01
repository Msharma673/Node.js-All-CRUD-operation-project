module.exports = (sequelize, DataTypes) => {
  return sequelize.define("employee", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  });
};
