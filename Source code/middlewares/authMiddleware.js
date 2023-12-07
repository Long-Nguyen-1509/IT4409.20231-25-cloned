const { verifyJwt, authenticate } = require("../utils/JWTUtils");
const { User, Role } = require("../models");

function authorization(requiredRole) {
  return async (req, res, next) => {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    try {
      const decoded = await verifyJwt(token);

      const user = await authenticate(decoded.username, decoded.password);

      if (user && user.role === requiredRole) {
        req.user = user;
        next();
      } else {
        res.status(403).json({ error: "Forbidden - Insufficient permissions" });
      }
    } catch (error) {
      console.error("Error verifying JWT or authenticating user:", error);
      res
        .status(403)
        .json({ error: "Forbidden - Invalid token or authentication error" });
    }
  };
}
