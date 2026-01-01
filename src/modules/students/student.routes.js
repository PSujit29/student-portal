const stuRouter = require("express").Router()
const { UserRoles, NonActiveStatuses } = require("../../shared/utils/constants");
const checkLogin = require("../../shared/middlewares/auth.middleware")
const stuCtrl = require("./student.controller");
const getLoggedInStudent = require("./student.middleware");
const Joi = require("joi");
const bodyValidator = require("../../shared/middlewares/validate.middleware");
const { updationRules, deletionRules } = require("./student.validation");

// for student only
stuRouter.route('/me')
    .get(checkLogin([UserRoles.STUDENT]), getLoggedInStudent(), stuCtrl.getMyProfile)
    .put(checkLogin([UserRoles.STUDENT]), bodyValidator(updationRules), getLoggedInStudent(), stuCtrl.updateMyProfile);

// for admin only

stuRouter.get('/', checkLogin([UserRoles.ADMIN]), stuCtrl.getAllStudents);

stuRouter.route('/:studentId')
    .get(checkLogin([UserRoles.ADMIN]), stuCtrl.getStudentDetail)
    .patch(checkLogin([UserRoles.ADMIN]), stuCtrl.updateStudentByAdmin)
    .delete(checkLogin([UserRoles.ADMIN]), bodyValidator(deletionRules), stuCtrl.deleteStudentByAdmin);


module.exports = stuRouter 