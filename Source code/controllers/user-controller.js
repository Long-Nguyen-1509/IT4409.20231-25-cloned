const UserService = require("../services/user-service");

exports.getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserByIdWithRole(req.params.id);
    res.status(200).json({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.Role.roleName,
      isBanned: user.isBanned,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.findAllUsersByNameOrEmail = async (req, res) => {
  try {
    const { query, page, pageSize } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedPageSize = parseInt(pageSize) || 10;

    const result = await UserService.findAllUsersByNameOrEmail(
      query,
      parsedPage,
      parsedPageSize
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await UserService.updateUser(req.query.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { newUser, token } = await UserService.registerUser(req.body);
    res.status(201).json({ user: newUser, token: token });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await UserService.loginUser(email, password);
    res.status(200).json({ user: user, token: token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const decoded = req.decoded;
    const token = req.userToken;
    await UserService.logoutUser(decoded.userId, token);
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const decoded = req.decoded;
    await UserService.changePassword(
      decoded.userId,
      req.body.oldPassword,
      req.body.newPassword
    );
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.banUser = async (req, res) => {
  try {
    const user = await UserService.banUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const user = await UserService.unbanUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const decoded = req.decoded;
    const enrolledCourses = await UserService.getEnrolledCourses(
      decoded.userId
    );
    res.status(200).json(enrolledCourses);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getCreatedCourses = async (req, res) => {
  try {
    const createdCourses = await UserService.getCreatedCourses(req.params.id);
    res.status(200).json(createdCourses);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createCourse = async (req, res) => {
  try {
    const data = req.body;
    const decoded = req.decoded;
    const userId = decoded.userId;
    const course = await UserService.createCourse(data, userId);
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params;
    const course = await UserService.updateCourse(data, id);
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const id = req.params;
    await UserService.deleteCourse(id);
    res.status(200);
  } catch (error) {
    res.status(500).json(error);
  }
};
