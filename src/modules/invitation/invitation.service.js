const crypto = require('crypto')
const InvitationModel = require('./invitation.model')
const emailService = require('../../shared/utils/email.util');
const { console } = require('inspector');

class InvitationService {

    async createTeacherInvitaion({ email, fullName, department }, invitedBy) {

        const existingInvite = await InvitationModel.findOne({ email });
        if (existingInvite) {
            throw { "error": "ALREADY_EXISTS" };
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

        const newInvitation = await InvitationModel.create({
            email,
            token: hashedToken,
            fullName,
            department,
            invitedBy: invitedBy
        })

        // emailService.sendInvite(email, rawToken).catch(err => {
        //     console.error("Email failed to send in background:", err);
        // });

        return { ...newInvitation.toObject(), rawToken };
    }

    async validateInvitaion(token, password) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const invitation = await InvitationModel.findOne({ token: hashedToken });

        if (!invitation) {
            throw { "error": "Invalid URL onboarding or expired token entry" };
        }

        // console.log(invitation)
        //TODO:call registerTeacherService()
        const registeredTeacher = await registerTeacherService.create({
            email: invitation.email,
            fullName: invitation.fullName,
            department: invitation.department,
            password: password,
        });
        

        // return <placeholder_register_detail_teacher>
    }

}

module.exports = new InvitationService()
