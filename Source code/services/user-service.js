const bcrypt = require("bcrypt");
const { generateJWT } = require("../utils/jwt-utils");
const {
  models: { User, Role, UserProfile, TokenBlacklist, Course, Enrollment },
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
