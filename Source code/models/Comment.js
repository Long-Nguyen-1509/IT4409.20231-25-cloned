const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const Course = require("./Course");
const User = require("./User");

const Comment = sequelize.define("Comment", {
  commentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: DataTypes.TEXT,
  createdDate: DataTypes.DATE,
});

Comment.belongsTo(User, { foreignKey: "userId" });
Comment.belongsTo(Course, { foreignKey: "courseId" });

module.exports = Comment;
