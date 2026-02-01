const inviteRouter = require('express').Router()
const inviterCtrl = require('./invitation.controller')
const {inviteRules} = require('./invitation.validation')

const { UserRoles } = require('../../shared/utils/constants');

const checkLogin = require("../../shared/middlewares/auth.middleware");
const bodyValidator = require('../../shared/middlewares/validate.middleware');
const requireAdmin = checkLogin([UserRoles.ADMIN])



inviteRouter.post('/', requireAdmin, bodyValidator(inviteRules), inviterCtrl.inviteTeacher);

module.exports = inviteRouter;