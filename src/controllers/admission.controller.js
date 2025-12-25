const applicantModel = require("../models/applicant.model");

class AdmissionController {
    async apply(req, res, next) {
        try {
            const user = req.loggedInUser; 
            const data = {
                ...req.body,
                userId: user._id,
            };

            const applicant = new applicantModel(data);
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