const ProfileModel = require("../profiles/profile.model");
const StudentModel = require("./student.model");
class StudentService {

    async getStudentProfile(userId) {
        if (!userId) {
            throw { code: 400, message: "User ID is required", status: "USER_ID_REQUIRED" };
        }
        const student = await StudentModel.findOne({ userId })
            .select('registrationNumber programme status currentSemester batch -_id')
            .lean();
        return { student };
    }

    async getStudentById(studentId) {
        const student = await StudentModel.findById(studentId)
            .select('-__v') //fetch all except version 
            .populate({
                path: 'userId',
                select: 'email role accountStatus isEmailVerified lastLoginAt',
            })
            .lean();

        if (!student) {
            throw { code: 404, message: "Student not found", status: "STUDENT_NOT_FOUND" };
        }

        // If your Profile is separate and linked via userId:
        const profile = await ProfileModel.findOne({ userId: student.userId._id })
            .select('fullName phone address profilePic bio')
            .lean();

        return {
            ...student,
            profile: profile || null
        };
    }

    //todo: come in future to decide updation is posible or not
    // if yes, uncomment else remove
    // async updateProfileByAdmin(userId, patch = {}) {
    //     const student = await StudentModel.findOne({ userId });
    //     if (!student) {
    //         throw { code: 404, message: "Student not found", status: "NOT_FOUND" };
    //     }

    //     const allowedFields = ["programme", "status", "currentSemester", "batch", "expectedGraduationDate"];

    //     allowedFields.forEach(field => {
    //         if (patch[field] !== undefined) {
    //             student[field] = patch[field];
    //         }
    //     });

    //     await student.save();
    //     return student;
    // }

    async getAllStudents({ page = 1, limit = 10, batch } = {}) {
        const skip = (Math.max(1, page) - 1) * limit;

        const query = {};
        if (batch) query.batch = batch;

        const [students, total] = await Promise.all([
            StudentModel.find(query).sort({ createdAt: 1 }).skip(skip).limit(limit),
            StudentModel.countDocuments(query),
        ]);

        return {
            students,
            page,
            limit,
            total,
        };
    }

    async createStudent(payload = {}) {
        const { userId, programme, batch, currentSemester, status, expectedGraduationDate } = payload;

        const existing = await StudentModel.findOne({ userId });
        if (existing) {
            throw { code: 409, message: "Student already exists for this user", status: "STUDENT_ALREADY_EXISTS" };
        }

        let student;
        let attempts = 0;

        // Handle RACE Condition
        while (!student && attempts < 3) {
            attempts += 1;

            const count = await StudentModel.countDocuments({ batch, programme });
            const sequence = String(count + 1).padStart(3, '0'); // 001, 002, ...
            const registrationNumber = `${batch}-${programme.toUpperCase()}-${sequence}`;

            try {
                student = await StudentModel.create({
                    userId,
                    registrationNumber,
                    programme,
                    batch,
                    currentSemester,       // or rely on default
                    status,                // or rely on default
                    expectedGraduationDate: expectedGraduationDate || null,
                });
            } catch (err) {
                // Handle duplicate registrationNumber
                if (err.code === 11000 && err.keyPattern && err.keyPattern.registrationNumber) {
                    student = null;
                    continue;
                }
                throw err;
            }
        }

        if (!student) {
            throw { code: 500, message: "Could not create student due to high server traffic. Please try clicking Save again.", status: "REGISTRATION_NUMBER_CONFLICT" };
        }

        return student;
    }
}
module.exports = new StudentService();

