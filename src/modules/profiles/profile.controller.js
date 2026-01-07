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
            const { userId } = req.loggedInUser;
            if (!userId) {
                throw { code: 404, message: "User not found" }
            }
            const body = req.body || {};

            const updatePatch = await courseService.updateProfile(userId, body);

            return res.status(200).json({
                data: updatePatch,
            });

        } catch (err) {
            next(err);
        }
    }

    async getAllProfiles(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await profileService.getAllProfiles({ page, limit });

            return res.status(200).json({
                data: result.data,
                message: "All Students Profile"
            });
        } catch (err) {
            next(err);
        }
    }

    async getUserProfileByAdmin(req, res, next) {
        try {
            const { userId } = req.params;
            const update = await profileService.viewProfile(userId);

            return res.status(200).json({
                data: update.data,
                message: "Updated Students Profile By Admin"
            });
        } catch (err) {
            next(err);
        }
    }

    async updateUserProfileByAdmin(req, res, next) {
        try {
            const { userId } = req.params;
            const body = req.body || {};

            const updatePatch = await courseService.updateProfileByAdmin(userId, body);

            return res.status(200).json({
                data: updatePatch,
            });
        } catch (err) {
            next(err);
        }
    }

    async viewStudentProfile(req, res, next) {
        
    }
}

module.exports = new ProfileController()