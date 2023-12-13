module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      sex: DataTypes.STRING,
      yearOfBirth: DataTypes.INTEGER,
      completedEducation: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      aboutMe: DataTypes.TEXT,
    },
    { tableName: "user_profile" }
  );
  return UserProfile;
};
