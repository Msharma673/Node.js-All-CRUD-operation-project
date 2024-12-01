const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./lib/index");
const { student, course, studentCourse } = require("./models");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());

// Seed Data
const courseData = [
  { title: "Math 101", description: "Basic Mathematics" },
  { title: "History 201", description: "World History" },
  { title: "Science 301", description: "Basic Sciences" },
];

const studentData = [{ name: "John Doe", age: 24 }];

// Endpoint to seed the database
app.get("/seed_courses_students", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await course.bulkCreate(courseData);
    await student.bulkCreate(studentData);
    res
      .status(200)
      .json({ message: "Courses and students database seeded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding data", error: error.message });
  }
});

// Helper function to add a new student
async function addNewStudent(newStudent) {
  const newData = await student.create(newStudent);
  return { newData };
}

// Endpoint to create a new student
app.post("/students/new", async (req, res) => {
  try {
    const newStudent = req.body.newStudent;
    const response = await addNewStudent(newStudent);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating student", error: error.message });
  }
});

// Helper function to update student by ID
async function updateStudentById(id, newStudentData) {
  const studentDetails = await student.findOne({ where: { id } });
  if (!studentDetails) {
    return { message: "Student not found" };
  }
  studentDetails.set(newStudentData);
  const updatedStudent = await studentDetails.save();
  return { message: "Student updated successfully", updatedStudent };
}

// Endpoint to update student by ID
app.post("/students/update/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const newStudentData = req.body;
    const response = await updateStudentById(id, newStudentData);
    if (!response.updatedStudent) {
      return res.status(404).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating student", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
