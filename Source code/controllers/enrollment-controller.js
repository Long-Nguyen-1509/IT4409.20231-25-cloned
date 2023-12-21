const EnrollmentService = require("../services/enrollment-service");

exports.enrollStudentInCourse = async (req, res) => {
  try {
    const decoded = req.decoded;
    await EnrollmentService.enrollStudentInCourse(
      decoded.userId,
      req.body.courseId
    );
    res.status(200).json({ message: "Student enrolled successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};
