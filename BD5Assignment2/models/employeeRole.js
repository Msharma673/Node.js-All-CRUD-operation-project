module.exports = (sequelize, DataTypes) => {
  return sequelize.define("employeeRole", {
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "employees",
        key: "id",
      },
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "roles",
        key: "id",
      },
      primaryKey: true,
    },
  });
};
