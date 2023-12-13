const bcrypt = require("bcrypt");
const { generateJWT } = require("../utils/jwt-utils");
const {
  models: { User, Role },
  sequelize,
} = require("../models");

exports.getUsers = async () => {
  return User.findAll();
};

exports.getUserById = async (userId) => {
  return User.findByPk(userId);
};

exports.getUserByIdWithRole = async (userId) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: Role,
    });

    return user;
  } catch (error) {
    console.error("Error finding user with role:", error);
    throw new Error("Error finding user with role");
  }
};

exports.updateUser = async (userId, updatedData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return "User not found";
    }

    const updatedUser = await user.update({ ...updatedData });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
};

exports.deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (user) {
    return user.destroy();
  }
  return null;
};

exports.registerUser = async (userData) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const token = await generateJWT(newUser);

    await transaction.commit();

    return token;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error registering user:", error);
    throw new Error("Registration failed");
  }
};

exports.authenticateUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return false;
    }
    const token = generateJWT(user);
    return token;
  } catch (error) {
    console.error("Error during user authentication:", error);
    throw error;
  }
};

exports.isUserBanned = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      return user.banned;
    }
  } catch (error) {
    console.error(error);
  }
};
