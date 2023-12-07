const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const Course = require("./Course");

const Lesson = sequelize.define("Lesson", {
  lessonId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: DataTypes.TEXT,
});

Lesson.belongsTo(Course, { foreignKey: "courseId" });

module.exports = Lesson;
