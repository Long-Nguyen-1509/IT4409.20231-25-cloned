const {
  models: { UserProfile },
  sequelize,
} = require("../models");
const userProfile = require("../models/user-profile");

exports.getUserProfileById = async (userId) => {
  try {
    console.log(userId);
    const userProfile = await UserProfile.findOne({
      where: { userId },
      attributes: { exclude: ["userId"] },
    });
    if (userProfile) {
      return userProfile;
    }
    throw new Error("User profile not found");
  } catch (error) {
    console.error("Error finding user profile:", error);
    throw new Error("Error finding user profile");
  }
};

exports.updateUserProfile = async (userId, updateData) => {
  try {
    const userProfile = await UserProfile.findOne({
      where: { userId },
    });
    if (userProfile) {
      const updatedUserProfile = await userProfile.update({
        ...updateData,
      });
      return updatedUserProfile;
    }
    return "User profile not found";
  } catch {
    confirm("Error updating user profile: " + error);
    throw error;
  }
};
