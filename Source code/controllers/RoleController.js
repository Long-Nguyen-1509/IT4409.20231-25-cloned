const RoleService = require("../services/RoleService");

exports.createRole = async (req, res) => {
  try {
    const { roleName } = req.body;
    const roleData = { roleName };
    const newRole = await RoleService.createRole(roleData);
    res.status(201).json(newRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
