const { Sequelize } = require("sequelize");
const config = require("../config/config.json");

const sequelize = new Sequelize(config.development);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.models = {};

db.models.User = require("./user.js")(sequelize, Sequelize.DataTypes);
db.models.UserProfile = require("./user-profile.js")(
  sequelize,
  Sequelize.DataTypes
);
db.models.Role = require("./role.js")(sequelize, Sequelize.DataTypes);
db.models.Course = require("./course.js")(sequelize, Sequelize.DataTypes);
db.models.Lesson = require("./lesson.js")(sequelize, Sequelize.DataTypes);
db.models.Resource = require("./resource.js")(sequelize, Sequelize.DataTypes);
db.models.Comment = require("./comment.js")(sequelize, Sequelize.DataTypes);
db.models.TokenBlacklist = require("./token-blacklist.js")(
  sequelize,
  Sequelize.DataTypes
);

// define associations
db.models.User.belongsTo(db.models.Role, { foreignKey: "roleId" });
db.models.Role.hasMany(db.models.User, { foreignKey: "roleId" });
db.models.User.hasOne(db.models.UserProfile, { foreignKey: "userId" });
db.models.UserProfile.belongsTo(db.models.User, { foreignKey: "userId" });
db.models.User.hasMany(db.models.Course, {
  as: "instructor",
  foreignKey: "instructorId",
});
db.models.Course.belongsTo(db.models.User, {
  as: "instructor",
  foreignKey: "instructorId",
});
db.models.User.belongsToMany(db.models.Course, {
  through: "Enrollment",
  foreignKey: "userId",
});
db.models.Course.belongsToMany(db.models.User, {
  through: "Enrollment",
  foreignKey: "courseId",
});
db.models.Course.hasMany(db.models.Lesson, { foreignKey: "courseId" });
db.models.Course.hasMany(db.models.Resource, { foreignKey: "courseId" });
db.models.User.hasMany(db.models.Comment, { foreignKey: "userId" });
db.models.Comment.belongsTo(db.models.User, { foreignKey: "userId" });
db.models.Course.hasMany(db.models.Comment, { foreignKey: "courseId" });
db.models.Comment.belongsTo(db.models.Course, { foreignKey: "courseId" });
db.models.User.hasMany(db.models.TokenBlacklist, { foreignKey: "userId" });
db.models.TokenBlacklist.belongsTo(db.models.User, { foreignKey: "userId" });

module.exports = db;
