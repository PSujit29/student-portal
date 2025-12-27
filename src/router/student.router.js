const stuRouter = require("express").Router()
const { UserRoles } = require("../config/constants.config")
const checkLogin = require("../middlewares/auth.middleware")
const stuCtrl = require("../controllers/student.controller")

// for student only
stuRouter.route('/me')
    .get(checkLogin([UserRoles.STUDENT]), stuCtrl.getMyProfile)
    .put(checkLogin([UserRoles.STUDENT]), stuCtrl.updateMyProfile);

// for admin only
stuRouter.get('/', checkLogin([UserRoles.ADMIN]), stuCtrl.getAllStudents);

stuRouter.route('/:studentId')
    .get(checkLogin([UserRoles.ADMIN]), stuCtrl.getStudentDetail)
    .patch(checkLogin([UserRoles.ADMIN]), stuCtrl.updateStudentByAdmin)
    .delete(checkLogin([UserRoles.ADMIN]), stuCtrl.deleteStudentByAdmin);


module.exports = stuRouter 