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
