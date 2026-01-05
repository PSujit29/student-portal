const EnrollmentModel = require("./enrollment.model");
const StudentModel = require("../students/student.model");
const CourseModel = require("../courses/course.model");
const { EnrollmentStatus } = require("../../shared/utils/constants");

class EnrollmentService {
    async listEnrollments({ page = 1, limit = 10, studentId, courseId, enrollmentStatus, batch, semester } = {}) {
        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const filter = {};
        if (studentId) filter.studentId = studentId;
        if (courseId) filter.courseId = courseId;
        if (enrollmentStatus) filter.enrollmentStatus = enrollmentStatus;
        if (batch) filter.batch = batch;
        if (semester) filter.semester = Number(semester);

        const [enrollments, total] = await Promise.all([
            EnrollmentModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .populate("studentId")
                .populate("courseId"),
            EnrollmentModel.countDocuments(filter),
        ]);

        return {
            data: enrollments,
            page: pageNumber,
            limit: pageSize,
            total,
        };
    }

    async ensureStudentExists(studentId) {
        if (!studentId) {
            const error = new Error("Student id is required");
            error.code = 400;
            error.status = "STUDENT_ID_REQUIRED";
            throw error;
        }

        const student = await StudentModel.findById(studentId);
        if (!student) {
            const error = new Error("Student not found");
            error.code = 404;
            error.status = "STUDENT_NOT_FOUND";
            throw error;
        }

        return student;
    }

    async ensureCourseExists(courseId) {
        if (!courseId) {
            const error = new Error("Course id is required");
            error.code = 400;
            error.status = "COURSE_ID_REQUIRED";
            throw error;
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            const error = new Error("Course not found");
            error.code = 404;
            error.status = "COURSE_NOT_FOUND";
            throw error;
        }

        return course;
    }

    async createEnrollment(payload = {}) {
        const { studentId, courseId, attemptNumber = 1 } = payload;

        await Promise.all([
            this.ensureStudentExists(studentId),
            this.ensureCourseExists(courseId),
        ]);

        try {
            const enrollment = await EnrollmentModel.create({
                studentId,
                courseId,
                batch: payload.batch,
                section: payload.section || null,
                semester: payload.semester || null,
                grade: payload.grade || null,
                attemptNumber,
                enrollmentStatus: payload.enrollmentStatus || EnrollmentStatus.ENROLLED,
            });

            return enrollment;
        } catch (err) {
            if (err && err.code === 11000) {
                const error = new Error("Enrollment already exists for this course and attempt");
                error.code = 400;
                error.status = "ENROLLMENT_ALREADY_EXISTS";
                throw error;
            }
            throw err;
        }
    }

    async getEnrollmentById(enrollmentId) {
        if (!enrollmentId) {
            const error = new Error("Enrollment id is required");
            error.code = 400;
            error.status = "ENROLLMENT_ID_REQUIRED";
            throw error;
        }

        const enrollment = await EnrollmentModel.findById(enrollmentId)
            .populate("studentId")
            .populate("courseId");

        if (!enrollment) {
            const error = new Error("Enrollment not found");
            error.code = 404;
            error.status = "ENROLLMENT_NOT_FOUND";
            throw error;
        }

        return enrollment;
    }

    async updateEnrollment(enrollmentId, patch = {}) {
        await this.getEnrollmentById(enrollmentId);

        const updatePatch = {};
        if (patch.grade !== undefined) updatePatch.grade = patch.grade;
        if (patch.enrollmentStatus) updatePatch.enrollmentStatus = patch.enrollmentStatus;
        if (patch.section !== undefined) updatePatch.section = patch.section;
        if (patch.batch !== undefined) updatePatch.batch = patch.batch;
        if (patch.semester !== undefined) updatePatch.semester = patch.semester;

        if (Object.keys(updatePatch).length === 0) {
            const error = new Error("Nothing to update");
            error.code = 400;
            error.status = "NOTHING_TO_UPDATE";
            throw error;
        }

        await EnrollmentModel.updateOne({ _id: enrollmentId }, { $set: updatePatch });

        return updatePatch;
    }

    async updateEnrollmentStatus(enrollmentId, enrollmentStatus) {
        if (!enrollmentStatus) {
            const error = new Error("Enrollment status is required");
            error.code = 400;
            error.status = "STATUS_REQUIRED";
            throw error;
        }

        if (!Object.values(EnrollmentStatus).includes(enrollmentStatus)) {
            const error = new Error("Invalid enrollment status value");
            error.code = 400;
            error.status = "INVALID_STATUS";
            throw error;
        }

        await this.getEnrollmentById(enrollmentId);

        await EnrollmentModel.updateOne({ _id: enrollmentId }, { $set: { enrollmentStatus } });

        return { enrollmentStatus };
    }
}

module.exports = new EnrollmentService();
