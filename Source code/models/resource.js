module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define("Resource", {
    resourceName: DataTypes.STRING,
    filePath: DataTypes.STRING,
  });

  return Resource;
};
