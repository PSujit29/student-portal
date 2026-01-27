const profileService = require("./profile.service");

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
                success: true,
                data: result.data,
                messsage: "Your Profile"
            });
        } catch (err) {
            next(err);
        }
    }

    async updateMyProfile(req, res, next) {
        try {
            const userId = req.loggedInUser?._id;
            if (!userId) {
                throw { code: 404, message: "User not found" }
            }
            const body = req.body || {};

            const updatePatch = await profileService.updateProfile(userId, body);

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

    async createUserProfile(req, res, next) {
        try {
            const payload = req.body || {};
            const profile = await profileService.createProfile(payload);

            return res.status(201).json({
                data: profile,
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

    // TODO: (admin updation) later add / improvise this to moderation
    // async updateUserProfileByAdmin(req, res, next) {
    //     try {
    //         const { userId } = req.params;
    //         const body = req.body || {};

    //         const updatePatch = await profileService.updateProfileByAdmin(userId, body);

    //         return res.status(200).json({
    //             data: updatePatch,
    //         });
    //     } catch (err) {
    //         next(err);
    //     }
    // }

    //todo: come here after student model haas been correctly implemented.
    async viewStudentProfile(req, res, next) {

    }


}

module.exports = new ProfileController()