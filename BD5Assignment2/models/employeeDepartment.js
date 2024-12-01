module.exports = (sequelize, DataTypes) => {
  return sequelize.define("employeeDepartment", {
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "employees",
        key: "id",
      },
      primaryKey: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: "departments",
        key: "id",
      },
      primaryKey: true,
    },
  });
};
