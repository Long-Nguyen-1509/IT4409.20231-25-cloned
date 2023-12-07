const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const User = require("./User");

const Role = sequelize.define("Role", {
  roleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Role.hasMany(User, { foreignKey: "roleId" });

module.exports = Role;
