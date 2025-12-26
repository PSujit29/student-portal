const ApplicantModel = require("../models/applicant.model");
const ApplicationModel = require("../models/admission.model");
const { ApplicationStatus } = require("../config/constants.config");

class AdmissionController {

    async apply(req, res, next) {
        try {
            const user = req.loggedInUser;
            const data = {
                ...req.body,
                userId: user._id,
            };
            //throw error if user has already applied
            const existingApplicant = await ApplicantModel.findOne({ userId: data.userId });
            if (existingApplicant) {
                throw {
                    code: 400,
                    error: new Error(`${user.name} has already applied. application id = ${existingApplicant._id}`),
                    message: "Already applied error",
                    status: "RE_APPLY_ERROR"
                };
            }
            const applicant = new ApplicantModel(data);
            const savedApplicant = await applicant.save();

            //for admission
            const admissionData = {
                applicantId: savedApplicant._id,
                status: ApplicationStatus.UNDER_REVIEW,
                isSubmitted: true,
            };
            const admissionDetail = new ApplicationModel(admissionData);
            const savedAdmissionDetail = await admissionDetail.save();

            // update user on the admission application
            res.json({
                success: true,
                message: "Admission application submitted",
                data: {
                    applicantId: savedApplicant._id,
                    applicationId: savedAdmissionDetail._id,
                    status: savedAdmissionDetail.status,
                    programme: savedApplicant.programme,
                },
            });
        } catch (err) {
            next(err);
        }
    }


    async getMyApplicationStatus(req, res, next) {
        try {
            const user = req.loggedInUser;

            const applicant = await ApplicantModel.findOne({ userId: user._id });
            if (!applicant) {
                return res.status(404).json({
                    success: false,
                    message: `No application found for user ${user.name}`,
                    user: {
                        id: user._id,
                        name: user.name,
                    },
                });
            }

            const application = await ApplicationModel.findOne({ applicantId: applicant._id });
            if (!application) {
                return res.status(404).json({
                    success: false,
                    message: `No admission record found for applicant ${user.name}`,
                    user: {
                        id: user._id,
                        name: user.name,
                    },
                });
            }

            res.json({
                success: true,
                message: "Fetched application status",
                data: {
                    status: application.status,
                    applicationId: application._id,
                    programme: applicant.programme,
                },
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AdmissionController