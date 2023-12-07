const express = require("express");
const { createRole } = require("../controllers/RoleController");

const router = express.Router();

router.post("/roles", createRole);

module.exports = router;
