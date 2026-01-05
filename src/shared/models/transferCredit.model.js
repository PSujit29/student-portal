const mongoose = require('mongoose');
const { createBaseSchema } = require('./base.model');
const { TransferStatus } = require('../utils/constants');
const CourseModel = require('../../modules/courses/course.model');

const transferCreditSchema = createBaseSchema({
    // ignore in MVP, but keep schema correct for later use
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    externalCourseName: {
        type: String,
        required: true,
        trim: true,
    },
    equivalentCourseId: {
        // reference to local Course table
        type: mongoose.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    creditsGranted: {
        type: Number,
        default: 0,
        min: 0,
    },
    approvalDate: {
        type: Date,
        // allow records without approval date for future statuses (e.g. pending)
        default: null,
    },
    status: {
        type: String,
        enum: Object.values(TransferStatus),
        default: TransferStatus.ACTIVE,
        required: true,
    },
});

// Prevent duplicate transfer entries for the same student/course/external course
transferCreditSchema.index(
    { studentId: 1, equivalentCourseId: 1, externalCourseName: 1 },
    { unique: true }
);

// Ensure creditsGranted does not exceed the target course's credit hours
transferCreditSchema.pre('validate', async function (next) {
    if (!this.equivalentCourseId || this.creditsGranted == null) {
        return next();
    }

    try {
        const course = await CourseModel.findById(this.equivalentCourseId).select('creditHours');
        if (course && typeof course.creditHours === 'number' && this.creditsGranted > course.creditHours) {
            return next(new Error('creditsGranted cannot exceed the course credit hours'));
        }

        next();
    } catch (err) {
        next(err);
    }
});

const TransferCreditModel = mongoose.model('TransferCredit', transferCreditSchema);

module.exports = TransferCreditModel;
