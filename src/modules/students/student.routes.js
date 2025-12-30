const stuRouter = require("express").Router()
const { UserRoles, NonActiveStatuses } = require("../../shared/utils/constants");
const checkLogin = require("../../shared/middlewares/auth.middleware")
const stuCtrl = require("./student.controller");
const getLoggedInStudent = require("./student.middleware");
const Joi = require("joi");
const bodyValidator = require("../../shared/middlewares/validate.middleware")


const updationRules = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{7,10}$/).optional(),
    address: Joi.string().min(1).max(100).optional()
}).min(1).unknown(false);//allow atleast one update else check is pointless and costly

// for student only
stuRouter.route('/me')
    .get(checkLogin([UserRoles.STUDENT]), getLoggedInStudent(), stuCtrl.getMyProfile)
    .put(checkLogin([UserRoles.STUDENT]), bodyValidator(updationRules), getLoggedInStudent(), stuCtrl.updateMyProfile);

// for admin only
const deletionRules = Joi.object({
    reason: Joi.string().valid(...Object.values(NonActiveStatuses)).required(true)
}).unknown(true);

stuRouter.get('/', checkLogin([UserRoles.ADMIN]), stuCtrl.getAllStudents);

stuRouter.route('/:studentId')
    .get(checkLogin([UserRoles.ADMIN]), stuCtrl.getStudentDetail)
    .patch(checkLogin([UserRoles.ADMIN]), stuCtrl.updateStudentByAdmin)
    .delete(checkLogin([UserRoles.ADMIN]), bodyValidator(deletionRules), stuCtrl.deleteStudentByAdmin);


module.exports = stuRouter 