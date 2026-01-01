const profileRouter = require("express").Router();
const profileCtrl = require("./profile.controller");
const checkLogin = require("../../shared/middlewares/auth.middleware");
const { UserRoles } = require("../../shared/utils/constants");
const uploader = require("../../shared/middlewares/upload.middleware");
// student + faculty view and update profile
profileRouter.route("/me")
    .get(checkLogin(), profileCtrl.getMyProfile)
    .put(checkLogin([UserRoles.STUDENT, UserRoles.FACULTY]), uploader().single('profilePic'), profileCtrl.updateMyProfile);

// 2️dmin for manage everyone profiles
profileRouter.route("/users")
    .get(checkLogin([UserRoles.ADMIN]), profileCtrl.getAllProfiles);

profileRouter.route("/users/:userId")
    .get(checkLogin([UserRoles.ADMIN]), profileCtrl.getUserProfileByAdmin)
    .patch(checkLogin([UserRoles.ADMIN]), profileCtrl.updateUserProfileByAdmin);

// // faculty + admin can view profiles but is read only
profileRouter.get("/students/:studentId", checkLogin([UserRoles.FACULTY, UserRoles.ADMIN]), profileCtrl.viewStudentProfile);

module.exports = profileRouter;
