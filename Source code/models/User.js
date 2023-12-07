const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const UserProfile = require("./UserProfile");
const Role = require("./Role");
const Course = require("./Course");

const User = sequelize.define("User", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasOne(UserProfile, { foreignKey: "userId" });
User.belongsTo(Role, { foreignKey: "roleId" });
User.belongsToMany(Course, { through: "UserCourse", foreignKey: "userId" });

module.exports = User;
