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

// instructor routes
router.use("/instructor", authorization("INSTRUCTOR"));
router.get(
  "/instructor/courses",
  userIdentifier(),
  UserController.getCreatedCourses
);
router.post(
  "/instructor/courses",
  userIdentifier(),
  UserController.createCourse
);
router.put(
  "/instructor/courses/:id",
  userIdentifier(),
  UserController.updateCourse
);
router.delete(
  "/instructor/courses/:id",
  userIdentifier(),
  UserController.deleteCourse
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
