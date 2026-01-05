const stuRouter = require("express").Router();
const checkLogin = require("../../shared/middlewares/auth.middleware");
const stuCtrl = require("./student.controller");
const { UserRoles } = require("../../shared/utils/constants");

// role helpers
const requireStudent = checkLogin([UserRoles.STUDENT]);
const requireAdmin = checkLogin([UserRoles.ADMIN]);

// initials of route:  localhost/studentportal/student/

stuRouter
    .route("/me")
    .get(requireStudent, stuCtrl.getMyProfile)
    .put(requireStudent, stuCtrl.updateMyProfile);

stuRouter
    .route("/")
    .get(requireAdmin, stuCtrl.getAllStudents);

stuRouter
    .route("/:studentId")
    .get(requireAdmin, stuCtrl.getStudentDetail)
    .patch(requireAdmin, stuCtrl.updateStudentByAdmin)
    .delete(requireAdmin, stuCtrl.deleteStudentByAdmin);

module.exports = stuRouter;