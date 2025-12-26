const mongoose = require('mongoose');
const { Programme, Relations } = require('../config/constants.config');

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    admissionId: {
        type: mongoose.Types.ObjectId,
        ref: "Admission",
        default: null
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
        required: true
    },
    batch: {
        type: String,
        default: null
    },
    semester: {
        type: Number,
        min: 1,
        max: 8,
        default: 1
    },
    // guardianInfo: {
    //     name: {
    //         type: String,
    //         default: null
    //     },
    //     phone: {
    //         type: String,
    //         default: null,
    //     },
    //     relation: {
    //         type: String,
    //         enum: Object.values(Relations),
    //         default: null
    //     }
    // }


}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true
});

const StudentModel = mongoose.model("Student", studentSchema);

module.exports = StudentModel