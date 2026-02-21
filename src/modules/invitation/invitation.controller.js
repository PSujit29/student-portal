const invitationService = require("./invitation.service")

class InvitationController {

    async createInvitation(req, res, next) {
        try {
            const initialData = req.body;
            const invitedBy = req.loggedInUser?._id;

            const invitation = await invitationService.createInvitation(initialData, invitedBy);

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

    async verifyToken(req, res, next) {
        try {
            const { token } = req.params;

            const data = await invitationService.verifyInvitation(token); //prefill data

            return res.status(200).json({
                success: true,
                message: "Invitation verified. Please complete your details.",
                prefill: data
            });
        } catch (err) {
            next(err);
        }
    }

    async getAllInvitations(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await invitationService.getAllInvitations({ page, limit });

            return res.status(200).json({
                data: result.data,
                message: "All Invitaions"
            });
        } catch (err) {
            next(err);
        }
    }

    async completeOnboarding(req, res, next) {
        try {
            const { token } = req.params;
            const details = req.body;

            const registrationResult = await invitationService.handleOnboarding(token, details)

            return res.status(201).json({
                success: true,
                message: "Onboarding Completed Successfully.",
                data: registrationResult
            });

        } catch (err) {
            next(err)
        }
    }

    async revokeInvitation(req, res, next) {
        //TODO: implement cancel invite
    }
}

module.exports = new InvitationController()