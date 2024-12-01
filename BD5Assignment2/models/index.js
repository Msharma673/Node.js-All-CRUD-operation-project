const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const Employee = require("./employee")(sequelize, DataTypes);
const Department = require("./department")(sequelize, DataTypes);
const Role = require("./role")(sequelize, DataTypes);
const EmployeeDepartment = require("./employeeDepartment")(
  sequelize,
  DataTypes,
);
const EmployeeRole = require("./employeeRole")(sequelize, DataTypes);

// Associations
Employee.belongsToMany(Department, {
  through: EmployeeDepartment,
  foreignKey: "employeeId",
  otherKey: "departmentId",
});
Department.belongsToMany(Employee, {
  through: EmployeeDepartment,
  foreignKey: "departmentId",
  otherKey: "employeeId",
});

Employee.belongsToMany(Role, {
  through: EmployeeRole,
  foreignKey: "employeeId",
  otherKey: "roleId",
});
Role.belongsToMany(Employee, {
  through: EmployeeRole,
  foreignKey: "roleId",
  otherKey: "employeeId",
});

module.exports = {
  sequelize,
  Employee,
  Department,
  Role,
  EmployeeDepartment,
  EmployeeRole,
};
