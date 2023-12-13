const { sign, verify } = require("jsonwebtoken");

exports.generateJWT = (user) => {
  const role = user.getRole.getRoleName;
  return sign(
    { userId: user.id, username: user.username, role: role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
};

exports.verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        const nowInSeconds = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < nowInSeconds) {
          reject(new Error("Token has expired"));
        } else {
          resolve(decoded);
          console.log(decoded);
        }
      }
    });
  });
};
