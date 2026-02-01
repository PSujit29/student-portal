const inviteRouter = require('express').Router()
const inviterCtrl = require('./invitation.controller')
const { inviteRules, registerRules } = require('./invitation.validation')
const { onboardingLimiter } = require('./inivitation.middleware')

const { UserRoles } = require('../../shared/utils/constants');

const checkLogin = require("../../shared/middlewares/auth.middleware");
const bodyValidator = require('../../shared/middlewares/validate.middleware');
const requireAdmin = checkLogin([UserRoles.ADMIN])


inviteRouter.route('/')
    .get(requireAdmin, inviterCtrl.getAllInvitations)// View all
    .post(requireAdmin, bodyValidator(inviteRules), inviterCtrl.createInvitation) // Invite

inviteRouter.route('/:token')
    .get(onboardingLimiter, inviterCtrl.verifyToken) //verify token
    .post(onboardingLimiter, bodyValidator(registerRules), inviterCtrl.completeTeacherOnboarding) //register form hamdle
    .delete(requireAdmin, inviterCtrl.revokeInvitation); // Cancel invite


//TODO: Make invitatin for student too.
//TODO: Come here after implementing student model

module.exports = inviteRouter;