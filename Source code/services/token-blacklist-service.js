const {
  models: { TokenBlacklist },
} = require("../models");

// exports.addToBlacklist = async (userId, token) => {
//   try {
//     await TokenBlacklist.create({
//       token,
//       userId,
//     });
//     return;
//   } catch (error) {
//     console.error("Error adding token to blacklist:", error);
//     return false;
//   }
// };

exports.isTokenBlacklisted = async (token) => {
  try {
    const result = await TokenBlacklist.findOne({
      where: {
        token,
      },
    });
    return !!result;
  } catch (error) {
    console.error("Error checking if token is blacklisted:", error);
    return false;
  }
};
