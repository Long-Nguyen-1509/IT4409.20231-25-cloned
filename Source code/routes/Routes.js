const express = require("express");
const RoleController = require("../controllers/role-controller");
const UserController = require("../controllers/user-controller");
const { authorization } = require("../middlewares/auth-middleware");

const router = express.Router();
router.post("/role", RoleController.createRole);
router.post("/register", UserController.registerUser);
router.post("/authenticate", UserController.authenticateUser);
router.put("/update", authorization("ADMIN"), UserController.updateUser);

module.exports = router;
