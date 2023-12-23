const UserProfileService = require("../services/user-profile-service");

exports.getUserProfileById = async (req, res) => {
  try {
    const userProfile = await UserProfileService.getUserProfileById(
      req.params.id
    );
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const decoded = req.decoded;
    const updateUserProfile = await UserProfileService.updateUserProfile(
      decoded.userId,
      req.body
    );
    res.status(200).json(updateUserProfile);
  } catch (error) {
    res.status(500).json(error);
  }
};
