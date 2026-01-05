const { Status } = require("../../shared/utils/constants");
const StudentModel = require("./student.model");
const UserModel = require("../../shared/models/user.model");

class StudentController {
    // route: studentportal/profile/
    async getMyProfile(req, res, next) {
        try {
            res.json({
                success: true,
                data: {
                    student: { _id: "stub_id", name: "John Doe", status: "ACTIVE" }
                },
                message: 'getMyProfile stub',
                status: 'TEST_GET_MY_PROFILE'
            });
        } catch (err) {
            next(err);
        }
    }

    async updateMyProfile(req, res, next) {
        try {
            const updatePayload = req.body || {};
            res.json({
                success: true,
                applicantPatch: updatePayload,
                message: "Profile updated successfully (stub)",
                status: "PROFILE_UPDATED"
            });
        } catch (err) {
            next(err);
        }
    }

    async getAllStudents(req, res, next) {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;

            res.json({
                success: true,
                data: [
                    { _id: "1", name: "Student A", status: "ACTIVE" },
                    { _id: "2", name: "Student B", status: "ACTIVE" }
                ],
                page,
                limit,
                message: 'getAllStudents success (stub)',
                status: 'TEST_GET_ALL_STUDENTS'
            });
        } catch (err) {
            next(err);
        }
    }

    async getStudentDetail(req, res, next) {
        try {
            const { studentId } = req.params;
            res.json({
                success: true,
                message: 'getStudentDetail by admin (stub)',
                data: { _id: studentId || "stub_id", name: "Stub Student" },
                status: 'TEST_GET_STUDENT_DETAIL'
            });
        } catch (err) {
            next(err);
        }
    }

    async updateStudentByAdmin(req, res, next) {
        try {
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
        try {
            const { studentId } = req.params;
            const reason = req.body.reason || "No reason provided";

            res.json({
                success: true,
                studentPatch: { status: reason },
                userPatch: { isActive: false },
                message: `deleteStudentByAdmin (stub) for ID: ${studentId}`,
                status: 'TEST_DELETE_STUDENT_BY_ADMIN'
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StudentController();