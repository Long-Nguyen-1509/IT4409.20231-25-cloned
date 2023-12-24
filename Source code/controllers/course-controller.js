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

exports.getCourseDetailForStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const decoded = req.decoded;
    const userId = decoded.userId;
    const course = await CourseService.getCourseDetailForStudent(id, userId);
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getCourseDetailForInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const decoded = req.decoded;
    const userId = decoded.userId;
    const course = await CourseService.getCourseDetailForInstructor(id, userId);
    res.status(200).json(course);
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
    const decoded = req.decoded;
    const userId = decoded.userId;
    const course = await CourseService.updateCourse(data, id, userId);
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const decoded = req.decoded;
    const userId = decoded.userId;
    await CourseService.deleteCourse(id, userId);
    res.status(200);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createLesson = async (req, res) => {
  try {
    const data = req.body;
    const decoded = req.decoded;
    const userId = decoded.userId;
    const { courseId } = req.params;
    const lesson = await CourseService.createLesson(data, courseId, userId);
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const data = req.body;
    const { courseId, lessonId } = req.params;
    const decoded = req.decoded;
    const userId = decoded.userId;
    const lesson = await CourseService.updateLesson(
      data,
      courseId,
      lessonId,
      userId
    );
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const decoded = req.decoded;
    const userId = decoded.userId;
    await CourseService.deleteLesson(courseId, lessonId, userId);
    res.status(200);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports;
