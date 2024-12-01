const { DataTypes, sequelize } = require("../lib");

const student = require("./student.model");
const course = require("./course.model");

const studentCourse = sequelize.define("studentCourse", {
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: student,
      key: "id",
    },
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: course,
      key: "id",
    },
  },
});

module.exports = studentCourse;
