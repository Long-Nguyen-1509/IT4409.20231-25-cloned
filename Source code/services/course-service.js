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
