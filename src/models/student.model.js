const mongoose = require('mongoose');
const { Programme, Relations, Status } = require('../config/constants.config');

const studentSchema = new mongoose.Schema({
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
        default: null,
    },
    expectedGraduationDate: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
});

const StudentModel = mongoose.model("Student", studentSchema);

module.exports = StudentModel