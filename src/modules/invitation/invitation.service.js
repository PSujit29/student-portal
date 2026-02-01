const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const InvitationModel = require('./invitation.model')
const emailService = require('../../shared/utils/email.util');
const UserModel = require('../../shared/models/user.model');
const FacultyModel = require('../faculty/faculty.model');
const ProfileModel = require('../profiles/profile.model');
const { Designation, UserRoles } = require('../../shared/utils/constants');
const { default: mongoose } = require('mongoose');

class InvitationService {

    async createTeacherInvitaion({ email, fullName, department }, invitedBy) {

        const existingInvite = await InvitationModel.findOne({ email });
        if (existingInvite) {
            throw { "error": "ALREADY_EXISTS" };
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')
        const deptArray = Array.isArray(department) ? department : [department];

        const newInvitation = await InvitationModel.create({
            email,
            token: hashedToken,
            fullName,
            deptArray,
            invitedBy: invitedBy
        })

        // emailService.sendInvite(email, rawToken).catch(err => {
        //     console.error("Email failed to send in background:", err);
        // });

        return { ...newInvitation.toObject(), rawToken };
    }

    async verifyInvitation(token) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const invitation = await InvitationModel.findOne({
            token: hashedToken,
            expiresAt: { $gt: new Date() },
            status: 'Pending'
        }).lean();

        if (!invitation) {
            throw new Error("INVITATION_INVALID_OR_EXPIRED");
        }

        return {
            email: invitation.email,
            fullName: invitation.fullName,
            department: invitation.department
        };
    }

    async handleTeacherOnboarding(token, fullTeacherDetails) {

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const invitation = await InvitationModel.findOne({
            token: hashedToken,
            expiresAt: { $gt: new Date() },
            status: 'Pending'
        });

        if (!invitation) {
            throw new Error("Invalid URL onboarding");
        }

        let { password, gender, phone, address, dob, designation } = fullTeacherDetails;


        //some data are assigned source of truth (database as invitation fetch)
        const registrationPayload = {
            user: { email: invitation.email, password },
            profile: { fullName: invitation.fullName, gender, phone, address, dob },
            faculty: { department: invitation.department, designation: designation || Designation.LECTURER },
            invitationId: invitation._id,
        }
        //cal register service function to individually register them
        const registeredTeacher = await this.registerTeacher(registrationPayload);

        return {
            message: "Teacher registered successfully",
            id: registeredTeacher._id,
        };
    }

    async getAllInvitations({ page = 1, limit = 10 } = {}) {
        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const [invitaions, total] = await Promise.all([
            InvitationModel.find({}).sort({ createdAt: 1 }).skip(skip).limit(pageSize),
            InvitationModel.countDocuments({}),
        ]);

        return {
            data: invitaions,
            page: pageNumber,
            limit: pageSize,
            total,
        };
    }

    async registerTeacher(details) {

        const { user, profile, faculty, invitationId } = details;

        const session = await mongoose.startSession();

        try {
            const result = await session.withTransaction(async () => {


                const existingUser = await UserModel.findOne({ email: user.email }).session(session);
                if (existingUser) throw new Error("Email already registered");

                const invitation = await InvitationModel.findOneAndUpdate(
                    { _id: invitationId, status: 'Pending', expiresAt: { $gt: new Date() } },
                    { status: 'Accepted' },
                    { session, new: true }
                );

                if (!invitation) {
                    throw new Error("Invitation is invalid or already used");
                }

                const hashedPass = await bcrypt.hash(user.password, 12);

                const [newUser] = await UserModel.create([{
                    ...user,
                    password: hashedPass,
                    role: UserRoles.FACULTY,
                }], { session });

                await ProfileModel.create([{
                    userId: newUser._id,
                    ...profile
                }], { session })

                await FacultyModel.create([{
                    userId: newUser._id,
                    ...faculty,
                }], { session });

                return newUser;
            })
            return result;

        } catch (error) {
            console.error("Transaction Error:", error.message);
            throw error;
        } finally {
            await session.endSession();
        }
    }
}
module.exports = new InvitationService()
