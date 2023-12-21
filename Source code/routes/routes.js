const express = require("express");
const RoleController = require("../controllers/role-controller");
const UserController = require("../controllers/user-controller");
const UserProfileController = require("../controllers/user-profile-controller");
const EnrollmentController = require("../controllers/enrollment-controller");
const {
  authorization,
  userIdentifier,
} = require("../middlewares/auth-middleware");

const router = express.Router();

// public routes

router.post("/public/register", UserController.registerUser);
router.post("/public/login", UserController.loginUser);
router.post("/public/logout", UserController.logoutUser);

// user routes
router.use("/user", authorization(["STUDENT", "INSTRUCTOR", "ADMIN"]));
router.get(
  "/user/:id",
  userIdentifier(),
  UserProfileController.getUserProfileById
);
router.put(
  "/user/:id/edit",
  userIdentifier(),
  UserProfileController.updateUserProfile
);
router.put(
  "/user/:id/change-password",
  userIdentifier(),
  UserController.changePassword
);

// student routes
router.use("/student", authorization("STUDENT"));
router.post("/student/enroll", EnrollmentController.enrollStudentInCourse);
router.get(
  "/student/:id/courses",
  userIdentifier(),
  UserController.getEnrolledCourses
);

// instructor routes
router.use("/instructor", authorization("INSTRUCTOR"));
router.get(
  "/instructor/:id/courses",
  userIdentifier(),
  UserController.getCreatedCourses
);

// admin routes
router.use("/admin", authorization("ADMIN"));
router.put("/admin/update", UserController.updateUser);
router.post("/role", RoleController.createRole);

router.get("/admin/users/search", UserController.findAllUsersByNameOrEmail);
router.get("/admin/users/:id", UserController.getUserById);
router.get(
  "/admin/users/:id/profile",
  UserProfileController.getUserProfileById
);
router.put("/admin/users/:id/ban", UserController.banUser);
router.put("/admin/users/:id/unban", UserController.unbanUser);
module.exports = router;
