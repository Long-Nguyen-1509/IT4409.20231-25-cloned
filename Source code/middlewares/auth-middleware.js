const { verifyJWT } = require("../utils/jwt-utils");
const { isTokenBlacklisted } = require("../services/token-blacklist-service");
const { getUserByIdWithRole } = require("../services/user-service");

exports.authorization = (requiredRole) => {
  return async (req, res, next) => {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing token" });
    }
    try {
      const isBlacklisted = await isTokenBlacklisted(token);
      if (isBlacklisted) {
        return res
          .status(401)
          .json({ error: "Unauthorized - Token is revoked" });
      }

      const decoded = await verifyJWT(token);
      req.decoded = decoded;
      const user = await getUserByIdWithRole(decoded.userId);
      if (
        user &&
        user.isBanned === false &&
        requiredRole.includes(decoded.role)
      ) {
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
};

exports.userIdentifier = () => {
  return async (req, res, next) => {
    try {
      const decoded = req.decoded;
      console.log(decoded.userId);
      console.log(req.params.id);
      if (
        (req.body &&
          req.body.id !== undefined &&
          decoded.userId === req.body.id) ||
        (req.params &&
          req.params.id !== undefined &&
          decoded.userId === parseInt(req.params.id, 10))
      ) {
        next();
      } else {
        res.status(403).json({
          error: "Forbidden - Unauthorized",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
};
