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
    batch: { // current year of admission
        type: Number,
        required: true,
        immutable: true,
    },
    expectedGraduationDate: {
        type: Date,
        default: null,
    },
});

// Common student query patterns
studentSchema.index({ programme: 1, status: 1, batch: 1 });

// Pre-validate hook to adjust fields based on status
// This runs synchronously; no need for a `next` callback.
studentSchema.pre('validate', function () {
    const nonActiveValues = Object.values(NonActiveStatuses || {});

    if (nonActiveValues.includes(this.status)) {
        this.currentSemester = null;
    }
});
const StudentModel = mongoose.model("Student", studentSchema);

module.exports = StudentModel