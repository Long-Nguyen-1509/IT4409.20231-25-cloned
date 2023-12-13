const { verifyJWT } = require("../utils/jwt-utils");
const { isTokenBlacklisted } = require("../services/token-blacklist-service");
const { getUserByIdWithRole } = require("../services/user-service");

// exports.authorization = (requiredRole) => {
//   return async (req, res, next) => {
//     const token =
//       req.headers.authorization && req.headers.authorization.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ error: "Unauthorized - Missing token" });
//     }

//     try {
//       const decoded = await verifyJwt(token);

//       const user = await authenticate(decoded.username, decoded.password);

//       if (user && user.role === requiredRole) {
//         req.user = user;
//         next();
//       } else {
//         res.status(403).json({ error: "Forbidden - Insufficient permissions" });
//       }
//     } catch (error) {
//       console.error("Error verifying JWT or authenticating user:", error);
//       res
//         .status(403)
//         .json({ error: "Forbidden - Invalid token or authentication error" });
//     }
//   };
// };

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
      const user = await getUserByIdWithRole(decoded.userId);
      console.log(user.id);
      if (
        user &&
        user.banned === false &&
        user.Role.roleName === requiredRole
      ) {
        console.log(user.Role.roleName);
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
