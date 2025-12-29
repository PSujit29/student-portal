const mongoose = require('mongoose');
const { EnrollmentStatus } = require('../config/constants.config');

const enrollmentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    enrollmentStatus: {
        type: String,
        enum: Object.values(EnrollmentStatus),
        default: EnrollmentStatus.ENROLLED,
    },
    grade: {
        type: String,
        default: null,
    },
    attemptNumber: {
        type: Number,
        default: 1,
        min: 1,
    },
    section: {
        type: String,
        default: null,
    },
    batch: {
        type: String,
        required: true,
    },

}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
});

// A student can have multiple attempts per course, but
// (studentId, courseId, attemptNumber) should be unique.
enrollmentSchema.index(
    { studentId: 1, courseId: 1, attemptNumber: 1 },
    { unique: true }
);

const EnrollmentModel = mongoose.model("Enrollment", enrollmentSchema);

module.exports = EnrollmentModel