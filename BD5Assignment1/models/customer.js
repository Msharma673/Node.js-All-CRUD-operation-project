module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Customer", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  });
};
