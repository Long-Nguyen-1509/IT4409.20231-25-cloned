module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define("Lesson", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: DataTypes.TEXT,
  });

  return Lesson;
};
