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


    async getAllApplications(req, res, next) {

        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 20;
            const skip = (page - 1) * limit;

            const filter = {};
            if (req.query.status) {
                filter.status = req.query.status;
            }

            // Returns a list of applications, joining Applicant + Admission (using populate) with basic fields: applicant name (from User or Applicant), programme, status, createdAt.
            const data = await ApplicationModel.find(filter)
                .populate({
                    path: "applicantId",
                    select: "programme userId",
                    populate: {
                        path: "userId",
                        select: "name email"
                    }
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            // reshape response (important)
            const result = data.map(app => ({
                applicationId: app._id,
                status: app.status,
                createdAt: app.createdAt,
                programme: app.applicantId?.programme,
                applicantName: app.applicantId?.userId?.name,
                applicantEmail: app.applicantId?.userId?.email
            }));

            res.json({
                data: result,
                page,
                limit,
                message: "List All Applications",
                status: "TEST_LIST_ALL_APPLICATIONS"
            });

        } catch (err) {
            next(err);
        }


    }

    async getApplicationDetailById(req, res, next) {
        /*{    GET /studentportal/admission/applications/:applicationId
        */
        try {
            const { applicationId } = req.params;
            if (!applicationId) {
                throw { code: 400, message: "applicationId missing", status: "APPLICATIONID_MISSING" };
            }

            const data = await ApplicationModel.findById(applicationId)
                .populate({
                    path: "applicantId",
                    select: "programme gender phone address dob userId",
                    populate: {
                        path: "userId",
                        select: "name email"
                    }
                })
                .lean();

            if (!data) {
                throw { code: 404, message: "application not found", status: "APPLICATION_NOT_FOUND" };
            }

            // reshape response
            const result = {
                applicationId: data._id,
                status: data.status,
                isSubmitted: data.isSubmitted,
                createdAt: data.createdAt,

                applicant: {
                    name: data.applicantId.userId.name,
                    email: data.applicantId.userId.email,
                    programme: data.applicantId.programme,
                    gender: data.applicantId.gender,
                    phone: data.applicantId.phone,
                    address: data.applicantId.address,
                    dob: data.applicantId.dob
                }
            };

            res.json({
                data: result,
                message: "List Application by ID",
                status: "TEST_LIST_APPLICATION_BY_ID"
            });

        } catch (exception) {
            next(exception)
        }
    }

    async updateApplicationStatus(req, res, next) {
        /*
        PATCH /studentportal/admission/applications/:id/status with body { status: "accepted" | "rejected" }.
        Validate allowed transitions (e.g., only from UNDER_REVIEW → ACCEPTED/REJECTED).
        If ACCEPTED: optionally flip user role from APPLICANT to STUDENT (this is a nice real-world touch).
        Optionally send email notification via your mail service (can be TODO for now).
        */
        try {

            
            

        } catch (exception) {
            next(exception);
        }
    }
}

module.exports = AdmissionController