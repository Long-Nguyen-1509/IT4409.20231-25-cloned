const bcrypt = require("bcrypt");
const { generateJWT } = require("../utils/jwt-utils");
const {
  models: { User, Role, UserProfile, TokenBlacklist, Course, Enrollment },
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
      include: [
        {
          model: Role,
          attributes: ["roleName"],
        },
      ],
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

    const userWithRole = await User.findByPk(newUser.id, {
      include: [{ model: Role, attributes: ["roleName"] }],
    });

    const role = userWithRole?.Role?.roleName;

    await UserProfile.create({
      fullName: userData.fullName,
      userId: newUser.id,
    });

    const token = await generateJWT(newUser, role);

    await transaction.commit();

    return { newUser: userWithRole, token };
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
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ["roleName"] }],
    });

    if (!user) {
      throw new Error("User does not exist");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("Password is incorrect");
    }
    const role = user.Role;
    console.log(role);
    const token = generateJWT(user, role);
    return { user, token };
  } catch (error) {
    console.error("Error during user authentication:", error);
    throw error;
  }
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found: " + userId);
    } else {
      const hashedPassword = await bcrypt.compare(oldPassword, user.password);
      if (hashedPassword) {
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.update({ password: newHashedPassword });
        return;
      } else {
        throw new Error("Old password is incorrect");
      }
    }
  } catch (error) {
    console.error("Error during change password:", error);
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

exports.createCourse = async (data, userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const { name, image, description } = data;
    return Course.create({ name, image, description, instructorId: userId });
  } catch (error) {}
};

exports.updateCourse = async (data, id) => {
  try {
    const { name, image, description } = data;
    const course = await Course.findByPk(id);
    if (!course) {
      throw new Error("Course not found");
    }
    return course.update({ name, image, description });
  } catch (error) {}
};

exports.deleteCourse = async (id) => {
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      throw new Error("Course not found");
    }
    const enrollment = await Enrollment.findOne({
      where: {
        courseId: id,
      },
    });
    if (enrollment) {
      throw new Error("Course has enrollment, cannot delete");
    }
    return course.destroy();
  } catch (error) {}
};
