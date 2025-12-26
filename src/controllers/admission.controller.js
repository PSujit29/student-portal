const ApplicantModel = require("../models/applicant.model");

class AdmissionController {
    async apply(req, res, next) {
        try {
            const user = req.loggedInUser;
            const data = {
                ...req.body,
                userId: user._id,
            };
            //throw error if user has already applied
            const applicantId = await ApplicantModel.findOne({ userId: data.userId });
            if (applicantId) {
                throw {
                    code: 400,
                    error: new Error(`${user.name} has already applied. application id = ${applicantId._id}`),
                    message: "Already applied error",
                    status: "RE_APPLY_ERROR"
                };
            }
            const applicant = new ApplicantModel(data);
            const savedApplicant = await applicant.save();

            res.json({
                data: {
                    _id: savedApplicant._id,
                    data: savedApplicant,
                },
                message: `successful admission application received from ${user.name}`,
                status: "TEST_APPLY_ADMISSION",
            });
        } catch (err) {
            next(err);
        }
    }

}

module.exports = AdmissionController