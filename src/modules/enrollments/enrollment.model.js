const mongoose = require('mongoose');
const { createBaseSchema } = require('../../shared/models/base.model');
const { EnrollmentStatus } = require('../../shared/utils/constants');

const enrollmentSchema = createBaseSchema({
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
        trim: true,
        minlength: 2,
        maxlength: 20,
        validate: {
            validator: function (value) {
                return /^[0-9]{4}[A-Za-z0-9\-]*$/.test(value);
            },
            message: 'Invalid batch format',
        },
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8,
    },

});

// Indexes for efficient queries
enrollmentSchema.index({ studentId: 1 });

// A student can have multiple attempts per course, but (studentId, courseId, attemptNumber) should be unique.
enrollmentSchema.index(
    { studentId: 1, courseId: 1, attemptNumber: 1 },
    { unique: true }
);

// Prevent multiple active (ENROLLED) enrollments for the same course
enrollmentSchema.index(
    { studentId: 1, courseId: 1 },
    {
        unique: true,
        partialFilterExpression: { enrollmentStatus: EnrollmentStatus.ENROLLED },
    }
);

// Cross-field validation for grade and enrollmentStatus
enrollmentSchema.pre('validate', function (next) {
    const hasGrade = this.grade !== null && this.grade !== undefined && this.grade !== '';

    if ((this.enrollmentStatus === EnrollmentStatus.COMPLETED || this.enrollmentStatus === EnrollmentStatus.FAILED) && !hasGrade) {
        return next(new Error('grade is required when enrollmentStatus is COMPLETED or FAILED'));
    }

    if (hasGrade && this.enrollmentStatus === EnrollmentStatus.ENROLLED) {
        return next(new Error('grade cannot be set while enrollmentStatus is ENROLLED'));
    }

    next();
});

const EnrollmentModel = mongoose.model("Enrollment", enrollmentSchema);

module.exports = EnrollmentModel