const {
  models: { Course },
} = require("../models");

const { Op } = require("sequelize");

exports.findAllCoursesByName = async (query, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const whereClause = {};

    if (query) {
      whereClause[Op.or] = [{ name: { [Op.like]: `%${query}%` } }];
    }

    const { count, rows } = await Course.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    });

    return {
      total: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      pageSize: pageSize,
      courses: rows,
    };
  } catch (error) {
    console.error("Error findning course by name:", error);
    throw error;
  }
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
