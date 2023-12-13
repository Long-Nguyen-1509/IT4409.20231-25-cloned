module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define("Course", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: DataTypes.STRING,
    description: DataTypes.STRING,
  });

  return Course;
};
