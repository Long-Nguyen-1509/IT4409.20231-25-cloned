const CourseService = require("../services/course-service");

exports.findAllCoursesByName = async (req, res) => {
  try {
    const { query, page, pageSize } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedPageSize = parseInt(pageSize) || 10;

    const result = await CourseService.findAllCoursesByName(
      query,
      parsedPage,
      parsedPageSize
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createCourse = async (req, res) => {
  try {
    const data = req.body;
    const decoded = req.decoded;
    const userId = decoded.userId;
    const course = await CourseService.createCourse(data, userId);
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const course = await CourseService.updateCourse(data, id);
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await CourseService.deleteCourse(id);
    res.status(200);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports;
