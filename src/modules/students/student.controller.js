const { Status } = require("../../shared/utils/constants");
const StudentModel = require("./student.model");
const UserModel = require("../../shared/models/user.model");

class StudentController {
    //route: studentportal/profile/

    async getMyProfile(req, res, next) {
        // student get /me 
        try {
            let student = req.loggedInStudent;
            if (!student) {
                throw { code: 404, message: "Forbidden Request call", status: "FORBIDDEN_REQUEST_CALL" }
            }
            if (!(student.status === Status.ACTIVE)) {
                throw { code: 400, message: "Frbidden! Inactive student cannot request" }
            }
            res.json({
                success: true,
                data: { student },
                message: 'getMyProfile',
                status: 'TEST_GET_MY_PROFILE'
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

    async getAllStudents(req, res, next) {
        //admin role checked already at checklogin
        // admin get '/'
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            const filter = {
                status: Status.ACTIVE
            }

            const allStudentData = await StudentModel.find(filter)
                .sort({ createdAt: -1 }).skip(skip).limit(limit);

            res.json({
                success: true,
                data: allStudentData,
                page,
                limit,
                message: 'getAllStudents success',
                status: 'TEST_GET_ALL_STUDENTS'
            });
        } catch (err) {
            next(err);
        }
    }

    async getStudentDetail(req, res, next) {
        // admin get /:studentId
        try {
            const { studentId } = req.params
            if (!studentId) {
                throw { code: 4000, message: "NO student Id" }
            }

            const student = await StudentModel.findById(studentId);
            if (!student) {
                throw { code: 404, message: "student not found" }
            }

            res.json({
                success: true,
                message: 'getStudentDetail by admin',
                data: student,
                status: 'TEST_GET_STUDENT_DETAIL'
            });
        } catch (err) {
            next(err);
        }
    }

    async updateStudentByAdmin(req, res, next) {
        // admin patch /:studentId
        try {
            //todo: 
            //ignored for mvp
            res.json({
                success: true,
                message: 'updateStudentByAdmin stub',
                data: null,
                status: 'TEST_UPDATE_STUDENT_BY_ADMIN'
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteStudentByAdmin(req, res, next) {
        // admin delete /:studentId
        try {
            const { studentId } = req.params;
            const reason = req.body;

            if (!studentId) {
                throw { code: 404, message: "NO student Id" }
            }

            let studentPatch = {}
            studentPatch.status = reason.reason;

            const student = await StudentModel.findById(studentId);
            if (!student) {
                throw { code: 404, message: "student not found" }
            }
            //changing the status to apply student patch
            await StudentModel.updateOne(
                { _id: studentId },
                { $set: studentPatch }
            );

            //apply user patch
            const userPatch = { isActive: false }
            const userID = student.userId;
            await UserModel.updateOne(
                { _id: userID },
                { $set: userPatch }
            );

            res.json({
                success: true,
                studentPatch,
                userPatch,
                message: 'deleteStudentByAdmin',
                status: 'TEST_DELETE_STUDENT_BY_ADMIN'
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StudentController();
