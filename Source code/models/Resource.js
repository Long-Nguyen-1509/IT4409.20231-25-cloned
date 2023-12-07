const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const Course = require("./Course");

const Resource = sequelize.define("Resource", {
  resourceId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  filePath: DataTypes.STRING,
});

Resource.belongsTo(Course, { foreignKey: "courseId" });

module.exports = Resource;
