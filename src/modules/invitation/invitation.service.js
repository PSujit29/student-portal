const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const InvitationModel = require('./invitation.model')
const emailService = require('../../shared/utils/email.util');
const authService = require('../auth/auth.service');
const UserModel = require('../../shared/models/user.model');
const FacultyModel = require('../faculty/faculty.model');
const ProfileModel = require('../profiles/profile.model');
const StudentModel = require('../students/student.model')
const { Designation, UserRoles } = require('../../shared/utils/constants');
const { default: mongoose } = require('mongoose');

class InvitationService {

    async createInvitation({ email, fullName, department, role, programme }, invitedBy) {

        const existingInvite = await InvitationModel.findOne({ email, role, status: 'Pending' });
        if (existingInvite) {
            throw new Error("INVITATION_ALREADY_EXISTS");
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

        const deptArray = Array.isArray(department) ? department : (department ? [department] : []);

        if (role === UserRoles.STUDENT && !programme) {
            throw new Error("PROGRAMME_REQUIRED_FOR_STUDENT");
        }
        if (role === UserRoles.FACULTY && deptArray.length === 0) {
            throw new Error("DEPARTMENT_REQUIRED_FOR_FACULTY");
        }


        const newInvitation = await InvitationModel.create({
            email,
            token: hashedToken,
            fullName,
            department: role === UserRoles.STUDENT ? null : deptArray, 
            role,
            programme: role === UserRoles.STUDENT ? programme : null,
            invitedBy
        })

        // emailService.sendInvite(email, rawToken).catch(err => {
        //     console.error("Email failed to send in background:", err);
        // });

        return { ...newInvitation.toObject(), rawToken };
    }

    async handleOnboarding(token, details) {

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const invitation = await InvitationModel.findOne({
            token: hashedToken,
            expiresAt: { $gt: new Date() },
            status: 'Pending'
        });

        if (!invitation) {
            throw new Error("Invalid URL onboarding");
        }

        const registrationData = {
            user: {
                email: invitation.email,
                password: details.password
            },
            profile: {
                fullName: invitation.fullName,
                gender: details.gender,
                phone: details.phone,
                permanentAddress: details.address,
                dob: details.dob
            },
            invitationId: invitation._id
        }

        if (invitation.role === UserRoles.FACULTY) {

            registrationData.faculty = {
                designation: Designation.LECTURER,
                department: invitation.department,
            }

            registrationData.student = null;

        }
        else if (invitation.role === UserRoles.STUDENT) {

            registrationData.student = {
                programme: invitation.programme,
                batch: new Date().getFullYear(),
                currentSemester: 1,
                registrationNumber: `${invitation.programme.toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
            };

            registrationData.faculty = null;

        }
        else throw new Error("Unsupported role for onboarding");


        const registeredUser = await this.registerInDatabase(registrationData);

        // try {
        //     await authService.sendActivationEmail(registeredUser, invitation.fullName);
        // } catch (err) {
        //     console.error("Failed to send activation email:", err);
        // }

        return {
            message: "Onboarding completed successfully. Check your email to activate your account.",
            id: registeredUser._id,
        };
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
            department: invitation.department || [],
            role: invitation.role,
            programme: invitation.programme || null,
        };
    }

    async getAllInvitations({ page = 1, limit = 10 } = {}) {
        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const [invitations, total] = await Promise.all([
            InvitationModel.find({}).sort({ createdAt: 1 }).skip(skip).limit(pageSize),
            InvitationModel.countDocuments({}),
        ]);

        return {
            data: invitations,
            page: pageNumber,
            limit: pageSize,
            total,
        };
    }

    async registerInDatabase(details) {

        const { user, profile, faculty, student, invitationId } = details;

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
                    role: invitation.role,
                }], { session });

                await ProfileModel.create([{
                    userId: newUser._id,
                    ...profile
                }], { session })

                if (faculty !== null) {
                    await FacultyModel.create([{
                        userId: newUser._id,
                        ...faculty,
                    }], { session });
                }
                if (student !== null) {
                    await StudentModel.create([{
                        userId: newUser._id,
                        ...student,
                    }], { session });
                }
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
