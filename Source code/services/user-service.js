const bcrypt = require("bcrypt");
const { generateJWT } = require("../utils/jwt-utils");
const {
  models: { User, Role, UserProfile },
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

exports.getUsers = async () => {
  return User.findAll();
};

exports.getUserById = async (userId) => {
  return User.findByPk(userId);
};

exports.getUserByIdWithRole = async (userId) => {
  try {
    const user = User.findOne({
      where: { id: userId },
      include: Role,
    });

    return user;
  } catch (error) {
    console.error("Error finding user with role:", error);
    throw new Error("Error finding user with role");
  }
};

// exports.findAllUsersByNameOrEmail = async (query) => {
//   try {
//     return User.findAll({
//       where: {
//         [Op.or]: [
//           { name: { [Op.iLike]: `%${query}%` } },
//           { email: { [Op.iLike]: `%${query}%` } },
//         ],
//       },
//     });
//   } catch (error) {
//     console.error("Error finding users by name or email:", error);
//     throw error;
//   }
// };

exports.findAllUsersByNameOrEmail = async (query, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const whereClause = {};

    if (query) {
      whereClause[Op.or] = [
        { fullName: { [Op.like]: `%${query}%` } },
        { email: { [Op.like]: `%${query}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    });

    return {
      total: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      pageSize: pageSize,
      users: rows,
    };
  } catch (error) {
    console.error("Error finding users by name or email:", error);
    throw error;
  }
};

exports.updateUser = async (userId, updatedData) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const updatedUser = await user.update({ ...updatedData });
      return updatedUser;
    }
    return "User not found";
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

    const role = await newUser.getRole();

    await UserProfile.create({
      fullName: userData.fullName,
      userId: newUser.id,
    });

    const token = await generateJWT(newUser, role);

    await transaction.commit();

    return { newUser, token };
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error registering user:", error);
    throw new Error("Registration failed");
  }
};

exports.loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    const role = await user.getRole();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return false;
    }
    const token = generateJWT(user, role);
    return { user, token };
  } catch (error) {
    console.error("Error during user authentication:", error);
    throw error;
  }
};

exports.logoutUser = async (userId, token) => {
  try {
    TokenBlacklist.create({
      token,
      userId,
    });
    return;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

exports.banUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found: " + userId);
    } else {
      const updatedUser = await user.update({ isBanned: true });
      return updatedUser;
    }
  } catch (error) {
    console.error("Error banning user:", error);
    throw error;
  }
};

exports.unbanUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found: " + userId);
    } else {
      const updatedUser = await user.update({ isBanned: false });
      return updatedUser;
    }
  } catch (error) {
    console.error("Error banning user:", error);
    throw error;
  }
};

exports.getEnrolledCourses = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      return user.getEnrolledCourses();
    }
  } catch (error) {}
};

exports.getCreatedCourses = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      return user.getCreatedCourses();
    }
  } catch (error) {}
};
