const { sequelize } = require("../lib");
const student = require("./student.model");
const course = require("./course.model");
const studentCourse = require("./studentCourse.model");

student.belongsToMany(course, { through: studentCourse });
course.belongsToMany(student, { through: studentCourse });

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((error) => console.error("Error syncing database:", error));

module.exports = { student, course, studentCourse };
