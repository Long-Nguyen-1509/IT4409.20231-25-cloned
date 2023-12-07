const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const User = require("./User");

const UserProfile = sequelize.define("UserProfile", {
  userProfileId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sex: DataTypes.STRING,
  yearOfBirth: DataTypes.INTEGER,
  completedEducation: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  aboutMe: DataTypes.TEXT,
});

UserProfile.belongsTo(User, { foreignKey: "userId" });

module.exports = UserProfile;
