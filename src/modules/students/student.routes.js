const stuRouter = require("express").Router();
const checkLogin = require("../../shared/middlewares/auth.middleware");
const stuCtrl = require("./student.controller");
const { UserRoles } = require("../../shared/utils/constants");
const { creationRules } = require("./student.validation");
const validator = require("../../shared/middlewares/validate.middleware");

// role helpers
const requireStudent = checkLogin([UserRoles.STUDENT]);
const requireAdmin = checkLogin([UserRoles.ADMIN]);

// initials of route:  localhost/studentportal/student/

stuRouter
    .route("/")
    .get(requireAdmin, stuCtrl.getAllStudents)
    .post(requireAdmin, validator(creationRules), stuCtrl.createStudentByAdmin);

stuRouter
    .route("/me")
    .get(requireStudent, stuCtrl.getMyStudentProfile)

stuRouter
    .route("/:studentId")
    .get(requireAdmin, stuCtrl.getStudentDetail)
    // .patch(requireAdmin, stuCtrl.updateStudentByAdmin) //no updation . no typos allowed because we use select on frontend
    .delete(requireAdmin, stuCtrl.deleteStudentByAdmin);

module.exports = stuRouter;