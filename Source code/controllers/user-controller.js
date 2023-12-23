const UserService = require("../services/user-service");

exports.registerUser = async (req, res) => {
  try {
    const token = await UserService.registerUser(req.body);
    res.status(201).json(token);
  } catch (error) {
    console.error("Registration failed:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await UserService.authenticateUser(email, password);
    res.json(token);
  } catch (error) {
    console.error("Authentication failed:", error.message);
    res.status(401).json({ error: "Authentication failed" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await UserService.updateUser(
      req.query.userId,
      req.body
    );
    res.json(updatedUser);
  } catch (error) {
    console.error("Update failed:", error.message);
    res.status(500).json({ error: "Update failed" });
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
