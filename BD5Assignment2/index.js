const express = require("express");
const db = require("./models");

const app = express();
app.use(express.json());

// Helper Functions
async function getEmployeeDepartments(employeeId) {
  const employeeDepartments = await db.EmployeeDepartment.findAll({
    where: { employeeId },
  });

  const departments = [];
  for (let empDep of employeeDepartments) {
    const department = await db.Department.findOne({
      where: { id: empDep.departmentId },
    });
    departments.push(department);
  }

  return departments;
}

async function getEmployeeRoles(employeeId) {
  const employeeRoles = await db.EmployeeRole.findAll({
    where: { employeeId },
  });

  const roles = [];
  for (let empRole of employeeRoles) {
    const role = await db.Role.findOne({
      where: { id: empRole.roleId },
    });
    roles.push(role);
  }

  return roles;
}

async function getEmployeeDetails(employeeData) {
  const departments = await getEmployeeDepartments(employeeData.id);
  const roles = await getEmployeeRoles(employeeData.id);

  return {
    ...employeeData.dataValues,
    departments,
    roles,
  };
}

// Seed Database
app.get("/seed_db", async (req, res) => {
  await db.sequelize.sync({ force: true });

  const departments = await db.Department.bulkCreate([
    { name: "Engineering" },
    { name: "Marketing" },
  ]);

  const roles = await db.Role.bulkCreate([
    { title: "Software Engineer" },
    { title: "Marketing Specialist" },
    { title: "Product Manager" },
  ]);

  const employees = await db.Employee.bulkCreate([
    { name: "Rahul Sharma", email: "rahul.sharma@example.com" },
    { name: "Priya Singh", email: "priya.singh@example.com" },
    { name: "Ankit Verma", email: "ankit.verma@example.com" },
  ]);

  // Associate employees with departments and roles using create method on junction models
  await db.EmployeeDepartment.create({
    employeeId: employees[0].id,
    departmentId: departments[0].id,
  });
  await db.EmployeeRole.create({
    employeeId: employees[0].id,
    roleId: roles[0].id,
  });

  await db.EmployeeDepartment.create({
    employeeId: employees[1].id,
    departmentId: departments[1].id,
  });
  await db.EmployeeRole.create({
    employeeId: employees[1].id,
    roleId: roles[1].id,
  });

  await db.EmployeeDepartment.create({
    employeeId: employees[2].id,
    departmentId: departments[0].id,
  });
  await db.EmployeeRole.create({
    employeeId: employees[2].id,
    roleId: roles[2].id,
  });

  return res.json({ message: "Database seeded!" });
});

// Exercise 1: Get All Employees
app.get("/employees", async (req, res) => {
  const employees = await db.Employee.findAll();
  const detailedEmployees = await Promise.all(
    employees.map(getEmployeeDetails),
  );
  res.json({ employees: detailedEmployees });
});

// Exercise 2: Get Employee by ID
app.get("/employees/details/:id", async (req, res) => {
  const employee = await db.Employee.findByPk(req.params.id);
  const detailedEmployee = await getEmployeeDetails(employee);
  res.json({ employee: detailedEmployee });
});

// Exercise 3: Get Employees by Department
app.get("/employees/department/:departmentId", async (req, res) => {
  const employeeDepartments = await db.EmployeeDepartment.findAll({
    where: { departmentId: req.params.departmentId },
  });

  const employees = [];
  for (let empDep of employeeDepartments) {
    const employee = await db.Employee.findOne({
      where: { id: empDep.employeeId },
    });
    const detailedEmployee = await getEmployeeDetails(employee);
    employees.push(detailedEmployee);
  }

  res.json({ employees });
});

// Exercise 4: Get Employees by Role
app.get("/employees/role/:roleId", async (req, res) => {
  const employeeRoles = await db.EmployeeRole.findAll({
    where: { roleId: req.params.roleId },
  });

  const employees = [];
  for (let empRole of employeeRoles) {
    const employee = await db.Employee.findOne({
      where: { id: empRole.employeeId },
    });
    const detailedEmployee = await getEmployeeDetails(employee);
    employees.push(detailedEmployee);
  }

  res.json({ employees });
});

// Exercise 5: Create New Employee
app.post("/employees/new", async (req, res) => {
  const employee = await db.Employee.create(req.body);
  res.json({ employee });
});



// Exercise 6: Update Employee by ID
app.post("/employees/update/:id", async (req, res) => {
  const employee = await db.Employee.findByPk(req.params.id);
  await employee.update(req.body);
  res.json({ employee });
});

// Exercise 7: Delete Employee
app.post("/employees/delete", async (req, res) => {
  await db.Employee.destroy({ where: { id: req.body.id } });
  res.json({
    message: `Employee with ID ${req.body.id} deleted successfully.`,
  });
});

// Start Server
app.listen(3000, () =>
  console.log("Server is running on http://localhost:3000"),
);
