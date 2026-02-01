const invitationService = require("./invitation.service")

class InvititationController {

    async inviteTeacher(req, res, next) {
        try {
            const teacherData = req.body;
            const invitedBy = req.loggedInUser?._id;

            const invitation = await invitationService.createTeacherInvitaion(teacherData, invitedBy);

            return res.status(201).json({
                success: true,
                message: "Invitation generated successfully.",
                data: {
                    email: invitation.email,
                    token: invitation.rawToken,
                    expiresAt: invitation.expiresAt,
                    invitedBy
                }
            });

        } catch (err) {
            next(err)
        }
    }

    async validateTeacher(req, res, next) {
        try {
            const token = req.params;

            const invitation = await invitationService.validateInvitaion(token);

            return res.status(201).json({
                success: true,
                message: "Teacher Invited Successfully.",
                data: {
                    invitation
                    // email: invitation.email,
                    // token: invitation.token,
                    // expiresAt: invitation.expiresAt
                }
            });

        } catch (err) {
            next(err)
        }
    }

}

module.exports = new InvititationController()