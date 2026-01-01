const { Status } = require("../../shared/utils/constants");
const profileService = require("./profile.service");
const UserModel = require("../../shared/models/user.model");
const errorHandler = require("../../shared/middlewares/error.middleware");

class ProfileController {
    //route: studentportal/profile/

    async getMyProfile(req, res, next) {
        try {
            const userId = req.loggedInUser?._id;
            if (!userId) {
                throw { code: 404, message: "User not found" }
            }
            const result = await profileService.viewProfile(userId);

            return res.status(200).json({
                data: result.data,
                messsage: "Your Profile"
            });
        } catch (err) {
            next(err);
        }
    }


    async updateMyProfile(req, res, next) {
        try {
            const profileId = req.loggedInUser?.profileId;
            if (!profileId) {
                throw { code: 404, message: "User not found" }
            }

            const body = { ...req.body };

            // if a profile picture was uploaded, add it to the patch
            if (req.file && req.file.filename) {
                body.profilePic = req.file.filename;
            }

            const updatePatch = await profileService.updateProfile(profileId, body);

            return res.status(200).json({
                data: updatePatch,
                message: "Profile updated successfully",
            });
        } catch (err) {
            next(err);
        }
    }

    async getAllProfiles(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await profileService.listProfiles({ page, limit });

            return res.status(200).json({
                data: result.data,
                meta: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                },
            });
        } catch (err) {
            next(err);
        }
    }

    async getUserProfileByAdmin(req, res, next) {
        try {
            const userId = req.params.userId
            const userProfile = await profileService.viewUserProfileById(userId)
            return res.status(200).json({
                data: userProfile
            });
        } catch (err) {
            next(err);
        }
    }

    async updateUserProfileByAdmin(req, res, next) {
        try {
            const { userId } = req.params;
            const body = { ...req.body } || {};

            const updatePatch = await profileService.updateProfileAdmin(userId, body);

            return res.status(200).json({
                data: updatePatch,
                message: "User profile updated successfully",
            });
        } catch (err) {
            next(err);
        }
    }

    async viewStudentProfile(req, res, next) {
        try {
            const { studentId } = req.params;

            if (!studentId) {
                const error = new Error("student id is required");
                error.code = 400;
                error.status = "STUDENT_ID_REQUIRED";
                throw error;
            }

            // reuse the same service used by admin, but route is restricted to FACULTY+ADMIN
            const studentProfile = await profileService.viewUserProfileById(studentId);

            return res.status(200).json({
                data: studentProfile,
                message: "Student profile",
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ProfileController()