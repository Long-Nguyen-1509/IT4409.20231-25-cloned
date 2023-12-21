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
    res.status(401).json(error);
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const token = await UserService.logoutUser(req.body.id, req.body.token);
    res.status(200);
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
    const enrolledCourses = await UserService.getEnrolledCourses(req.params.id);
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
