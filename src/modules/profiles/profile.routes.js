const profileRouter = require("express").Router();
const profileCtrl = require("./profile.controller");
const checkLogin = require("../../shared/middlewares/auth.middleware");
const { UserRoles } = require("../../shared/utils/constants");
const { updationRules, creationRules } = require("./profile.validation");
const bodyValidator = require("../../shared/middlewares/validate.middleware");
const requireAdmin = checkLogin([UserRoles.ADMIN]);

// student + faculty view and update profile
profileRouter.route("/me")
    .get(checkLogin(), profileCtrl.getMyProfile)
    .patch(checkLogin([UserRoles.STUDENT, UserRoles.FACULTY]), bodyValidator(updationRules), profileCtrl.updateMyProfile);

// Admin/Management
profileRouter.route("/users")
    .get(requireAdmin, profileCtrl.getAllProfiles)
    .post(requireAdmin, bodyValidator(creationRules), profileCtrl.createUserProfile);

profileRouter.route("/users/:userId")
    .get(requireAdmin, profileCtrl.getUserProfileByAdmin); 
    // TODO: Add Admin update logic if regulation (e.g. Profile Pic moderation) is needed

// Faculty/Admin view students
// Logic inside controller will restrict faculty to students they actually teach
profileRouter.get("/students/:studentId", checkLogin([UserRoles.FACULTY, UserRoles.ADMIN]), profileCtrl.viewStudentProfile);


module.exports = profileRouter;
