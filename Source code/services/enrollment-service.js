const {
  models: { Enrollment, User, Course },
} = require("../models");

exports.enrollStudentInCourse = async (studentId, courseId) => {
  try {
    const student = await User.findByPk(studentId);
    const course = await Course.findByPk(courseId);
    if (student && course) {
      course.addStudent(student);
      return;
    }
    return "Unable to find student or course";
  } catch (error) {
    console.log("Error adding student into course", error);
    throw error;
  }
};
