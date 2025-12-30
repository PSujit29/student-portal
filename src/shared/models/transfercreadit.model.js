const mongoose = require('mongoose');
const { TransferStatus } = require('../utils/constants');

const transferCreditSchema = new mongoose.Schema({
    // ignore in MVP, but keep schema correct for later use
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "Student",
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
        ref: "Course",
        required: true,
    },
    creditsGranted: {
        type: Number,
        default: 0,
        min: 0,
    },
    approvalDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(TransferStatus),
        default: TransferStatus.ACTIVE,
        required: true,
    },

}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
});

const TransferCreditModel = mongoose.model("TransferCredit", transferCreditSchema);

module.exports = TransferCreditModel