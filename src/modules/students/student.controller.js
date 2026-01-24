const studentService = require("./student.service");

class StudentController {
    // route: studentportal/profile/

    async getMyStudentProfile(req, res, next) {
        try {
            const userId = req.loggedInUser?._id;
            const {student} = await studentService.getStudentProfile(userId);

            return res.status(200).json({
                success: true,
                student,
                message: "Your Student Profile"
            });
        } catch (err) {
            next(err);
        }
    }

    async createStudentByAdmin(req, res, next) {
        try {
            const payload = req.body; 
            const student = await studentService.createStudent(payload);

            return res.status(201).json({
                success: true,
                data: student,
                message: "Student created successfully",
            });
        } catch (err) {
            next(err);
        }
    }

    // async updateStudentByAdmin(req, res, next) {
    //     try {
    //         const { studentId } = req.params; // Matches /:studentId in router
    //         const updatedStudent = await studentService.updateStudent(studentId, req.body);

    //         return res.status(200).json({
    //             success: true,
    //             data: updatedStudent,
    //             message: "Student updated successfully"
    //         });
    //     } catch (err) {
    //         next(err);
    //     }
    // }

    async getAllStudents(req, res, next) {
        try {
            const { page, limit, batch } = req.query;
            const result = await studentService.getAllStudents({ page, limit, batch });

            return res.status(200).json({
                data: result,
                message: "All Students Profile"
            });
        } catch (err) {
            next(err);
        }
    }

    async getStudentDetail(req, res, next) {
        try {
            const  studentId  = req.params?.studentId;
            const student = await studentService.getStudentById(studentId);
            res.json({
                success: true,
                message: 'getStudentDetail by admin',
                student,
                status: 'TEST_GET_STUDENT_DETAIL'
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteStudentByAdmin(req, res, next) {
        // TODO: Complete this once all dependencies has been clear
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