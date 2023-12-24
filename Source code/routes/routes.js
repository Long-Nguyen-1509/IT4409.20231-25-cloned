const express = require("express");
const RoleController = require("../controllers/role-controller");
const UserController = require("../controllers/user-controller");
const UserProfileController = require("../controllers/user-profile-controller");
const EnrollmentController = require("../controllers/enrollment-controller");
const CourseController = require("../controllers/course-controller");
const {
  authorization,
  userIdentifier,
} = require("../middlewares/auth-middleware");

const router = express.Router();

// public routes

router.post("/public/register", UserController.registerUser);
router.post("/public/login", UserController.loginUser);
router.get("/public/users/:id", UserProfileController.getUserProfileById);
// router.get("/public/courses/:id", CourseController.getCourseById);
router.get("/public/courses/search", CourseController.findAllCoursesByName);

// user routes
router.use("/user", authorization(["STUDENT", "INSTRUCTOR", "ADMIN"]));
router.post("/user/logout", UserController.logoutUser);
router.put("/user/edit-profile", UserProfileController.updateUserProfile);
router.put("/user/change-password", UserController.changePassword);

// student routes
router.use("/student", authorization("STUDENT"));
router.post("/student/enroll", EnrollmentController.enrollStudentInCourse);
router.get("/student/courses", UserController.getEnrolledCourses);
router.get(
  "/student/courses/:id",
  CourseController.getCourseDetailForStudent
);

// instructor routes
router.use("/instructor", authorization("INSTRUCTOR"));
router.get(
  "/instructor/courses",
  userIdentifier(),
  UserController.getCreatedCourses
);
router.get(
  "/instructor/courses/:id",
  CourseController.getCourseDetailForInstructor
);
router.post("/instructor/courses", CourseController.createCourse);
router.put("/instructor/courses/:id", CourseController.updateCourse);
router.delete("/instructor/courses/:id", CourseController.deleteCourse);

// lessons
router.post(
  "/instructor/courses/:courseId/lessons",
  CourseController.createLesson
);
router.put(
  "/instructor/courses/:courseId/lessons/:lessonId",
  CourseController.updateLesson
);
router.delete(
  "/instructor/courses/:courseId/lessons/:lessonId",
  CourseController.deleteLesson
);

// Resources
router.get(
  "/instructor/courses/:courseId/resources",
  CourseController.getResourcesByCourseId
);
router.post(
  "/instructor/courses/:courseId/resources",
  CourseController.createResource
);
router.put(
  "/instructor/courses/:courseId/resources/:resourceId",
  CourseController.updateResource
);
router.delete(
  "/instructor/courses/:courseId/resources/:resourceId",
  CourseController.deleteResource
);

// admin routes
router.use("/admin", authorization("ADMIN"));
router.put("/admin/update", UserController.updateUser);
router.post("/role", RoleController.createRole);

router.get("/admin/users/search", UserController.findAllUsersByNameOrEmail);
router.get("/admin/users/:id", UserController.getUserById);
// router.get(
//   "/admin/users/:id/profile",
//   UserProfileController.getUserProfileById
// );
router.put("/admin/users/:id/ban", UserController.banUser);
router.put("/admin/users/:id/unban", UserController.unbanUser);
module.exports = router;
