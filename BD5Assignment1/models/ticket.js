module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Ticket", {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    priority: DataTypes.INTEGER,
  });
};
