const stuRouter = require("express").Router()
const { UserRoles } = require("../config/constants.config")
const checkLogin = require("../middlewares/auth.middleware")
const stuCtrl = require("../controllers/student.controller");
const getLoggedInStudent = require("../middlewares/student.middleware");

// for student only
stuRouter.route('/me')
    .get(checkLogin([UserRoles.STUDENT]), stuCtrl.getMyProfile)
    .put(checkLogin([UserRoles.STUDENT]), stuCtrl.updateMyProfile);

// for admin only
stuRouter.get('/', checkLogin([UserRoles.ADMIN]), getLoggedInStudent, stuCtrl.getAllStudents);

stuRouter.route('/:studentId')
    .get(checkLogin([UserRoles.ADMIN]), getLoggedInStudent, stuCtrl.getStudentDetail)
    .patch(checkLogin([UserRoles.ADMIN]), getLoggedInStudent, stuCtrl.updateStudentByAdmin)
    .delete(checkLogin([UserRoles.ADMIN]), getLoggedInStudent, stuCtrl.deleteStudentByAdmin);


module.exports = stuRouter 