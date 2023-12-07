const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const User = require("./User");
const Lesson = require("./Lesson");
const Resource = require("./Resource");
const Comment = require("./Comment");
const Enrollment = require("./Enrollment");

const Course = sequelize.define("Course", {
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: DataTypes.STRING,
  createdDate: DataTypes.DATE,
});

Course.hasMany(Lesson, { foreignKey: "courseId" });
Course.hasMany(Resource, { foreignKey: "courseId" });
Course.hasMany(Comment, { foreignKey: "courseId" });
Course.belongsTo(User, { foreignKey: "instructorId", as: "instructor" });
Course.belongsToMany(User, { through: "UserCourse" });

module.exports = Course;
