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

exports;
