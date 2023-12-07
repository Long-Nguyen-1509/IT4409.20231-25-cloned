const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

async function compareEncryptedPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

async function authenticate(username, password) {
  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !(await compareEncryptedPassword(password, user.password))) {
      return false;
    }

    return user;
  } catch (error) {
    console.error("Error during user authentication:", error);
    throw error;
  }
}

function generateJwt(user) {
  return jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    secretKey,
    { expiresIn: "1h" }
  );
}

function verifyJwt(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

module.exports = {
  authenticate,
  generateJwt,
  verifyJwt,
};
