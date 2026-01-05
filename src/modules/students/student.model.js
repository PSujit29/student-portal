const mongoose = require('mongoose');
const { createBaseSchema } = require('../../shared/models/base.model');
const { Programme, Status, NonActiveStatuses } = require('../../shared/utils/constants');

const studentSchema = createBaseSchema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    registrationNumber: {
        type: String,
        unique: true,
        required: true,
        immutable: true,
    },
    programme: {
        type: String,
        enum: Object.values(Programme),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.ACTIVE,
    },
    currentSemester: {
        type: Number,
        min: 1,
        max: 8,
        default: 1,
    },
    batch: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20,
        validate: {
            validator: function (value) {
                // allow patterns like "2023", "2023A", "2023-CSIT"
                return /^[0-9]{4}[A-Za-z0-9\-]*$/.test(value);
            },
            message: 'Invalid batch format',
        },
    },
    expectedGraduationDate: {
        type: Date,
        default: null,
    },
});

// Common student query patterns
studentSchema.index({ programme: 1, status: 1, batch: 1 });

// Prevent storing a current semester for non-active students
studentSchema.pre('validate', function (next) {
    const nonActiveValues = Object.values(NonActiveStatuses || {});
    if (nonActiveValues.includes(this.status) && this.currentSemester !== null) {
        return next(new Error('currentSemester must be null for non-active students'));
    }
    next();
});

// Basic status transition guard: once non-active, do not go back to ACTIVE
studentSchema.pre('validate', async function (next) {
    if (this.isNew || !this._id) return next();

    try {
        const existing = await this.constructor.findById(this._id).select('status');
        if (!existing) return next();

        const wasNonActive = Object.values(NonActiveStatuses || {}).includes(existing.status);
        if (wasNonActive && this.status === Status.ACTIVE) {
            return next(new Error('Cannot transition student status from non-active back to ACTIVE'));
        }

        next();
    } catch (err) {
        next(err);
    }
});

const StudentModel = mongoose.model("Student", studentSchema);

module.exports = StudentModel