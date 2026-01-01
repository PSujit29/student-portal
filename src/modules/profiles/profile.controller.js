const { Status } = require("../../shared/utils/constants");
const profileService = require("./profile.service");
const UserModel = require("../../shared/models/user.model");
const errorHandler = require("../../shared/middlewares/error.middleware")

class ProfileController {
    //route: studentportal/profile/

    async getMyProfile(req, res, next)  {
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
            let student = req.loggedInStudent;
            if (!student) {
                throw { code: 404, message: "Forbidden Request call", status: "FORBIDDEN_REQUEST_CALL" }
            }
            if (!(student.status === Status.ACTIVE)) {
                throw { code: 400, message: "Forbidden! Inactive student cannot request" }
            }

            const updatePayload = req.body || {};

            let applicantPatch = {};

            if (updatePayload.phone) applicantPatch.phone = updatePayload.phone;
            if (updatePayload.address) applicantPatch.address = updatePayload.address;

            // INVARIANT #2 — nothing to update
            const nothingToUpdate = Object.keys(applicantPatch).length === 0;

            if (nothingToUpdate) {
                return res.status(400).json({
                    success: false,
                    message: "Nothing to update",
                    status: "NOTHING_TO_UPDATE"
                });
            }

            const userId = req.loggedInUser?._id;
            if (!userId) {
                throw { code: 404, message: "User Not Found", status: "USER_NOT_FOUND" };
            }

            const applicant = await ApplicantModel.findOne({ userId });
            if (!applicant) {
                throw { code: 404, message: "Applicant Not Found", status: "APPLICANT_NOT_FOUND" };
            }


            if (Object.keys(applicantPatch).length) {
                await ApplicantModel.updateOne(
                    { _id: applicant._id },
                    { $set: applicantPatch }
                );
            }

            return res.json({
                success: true,
                applicantPatch,
                message: "Profile updated successfully",
                status: "PROFILE_UPDATED"
            });

        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ProfileController()