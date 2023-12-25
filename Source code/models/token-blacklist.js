module.exports = (sequelize, DataTypes) => {
  const TokenBlacklist = sequelize.define("TokenBlacklist", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return TokenBlacklist;
};
