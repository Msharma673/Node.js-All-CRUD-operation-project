const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./lib/index");
const Employee = require("./models/employee.model");

const { parse } = require("querystring");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());

const seedEmployees = [
  {
    name: "John Doe",
    designation: "Manager",
    department: "Sales",
    salary: 90000,
  },
  {
    name: "Anna Brown",
    designation: "Developer",
    department: "Engineering",
    salary: 80000,
  },
  {
    name: "James Smith",
    designation: "Designer",
    department: "Marketing",
    salary: 70000,
  },
  {
    name: "Emily Davis",
    designation: "HR Specialist",
    department: "Human Resources",
    salary: 60000,
  },
  {
    name: "Michael Wilson",
    designation: "Developer",
    department: "Engineering",
    salary: 85000,
  },
  {
    name: "Sarah Johnson",
    designation: "Data Analyst",
    department: "Data Science",
    salary: 75000,
  },
  {
    name: "David Lee",
    designation: "QA Engineer",
    department: "Quality Assurance",
    salary: 70000,
  },
  {
    name: "Linda Martinez",
    designation: "Office Manager",
    department: "Administration",
    salary: 50000,
  },
  {
    name: "Robert Hernandez",
    designation: "Product Manager",
    department: "Product",
    salary: 95000,
  },
  {
    name: "Karen Clark",
    designation: "Sales Associate",
    department: "Sales",
    salary: 55000,
  },
];

// Endpoint to seed the database
app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await Employee.bulkCreate(seedEmployees);
    res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding the data", error: error.message });
  }
});

// Fetch all employees
app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json({ employees });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employees", error: error.message });
  }
});

// Add a new employee
app.post("/employees/new", async (req, res) => {
  const newEmployee = req.body;

  try {
    const employee = await Employee.create(newEmployee);
    res.status(201).json({ newEmployee: employee });
  } catch (error) {
    res.status(500).json({
      message: "Error adding new employee",
      error: error.message,
    });
  }
});

// Update an employee by ID
app.put("/employees/update/:id", async (req, res) => {
  const id = req.params.id;
  const newEmployeeData = req.body;

  try {
    const employee = await Employee.findByPk(id);
    if (employee) {
      await employee.update(newEmployeeData);
      res.status(200).json({
        message: "Employee updated successfully",
        updatedEmployee: employee,
      });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
  }
});

// Delete an employee by ID
app.delete("/employees/delete", async (req, res) => {
  const { id } = req.body; // Destructure id from the body
  try {
    if (!id) {
      return res.status(400).json({ message: "ID is required for deletion." });
    }

    const employee = await Employee.findByPk(id);
    if (employee) {
      await employee.destroy();
      res.status(200).json({ message: "Employee record deleted successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
