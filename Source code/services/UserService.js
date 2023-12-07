const { User } = require("../models/User");

exports.createUser = async (userData) => {
  return User.create(userData);
};

exports.getUsers = async () => {
  return User.findAll();
};

exports.getUserById = async (userId) => {
  return User.findByPk(userId);
};

exports.updateUser = async (userId, updatedData) => {
  const user = await User.findByPk(userId);
  if (user) {
    return user.update(updatedData);
  }
  return null;
};

exports.deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (user) {
    return user.destroy();
  }
  return null;
};
