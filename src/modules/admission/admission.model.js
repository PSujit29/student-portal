const mongoose = require('mongoose');
const { createBaseSchema } = require('../../shared/models/base.model');
const UserModel = require('../../shared/models/user.model');
const { Programme } = require('../../shared/utils/constants');


const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String },
    url: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const admissionSchema = createBaseSchema({

    // Admission Model: userId, programApplied, entranceRollNumber, entranceScore, admissionStatus, applicationFeePaid, seeGradesheet, nebGradesheet, migrationCertificate, provisionalCertificate, characterCertificate, citizenshipDocument, gapCertificate(optional), assignedReviewerId, reviewerRemarks.

    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    programApplied: {
        type: String,
        enum: Object.values(Programme),
        required: true,
    },
    entranceRollNumber: {
        type: Number,
        required: true,
    },
    entranceScore: {
        type: Number,
        required: false,
    },
    admissionStatus: {
        type: String,
        enum: Object.values(AdmissionStatus),
        default: 'pending'
    },
    applicationFeePaid: {
        type: Boolean,
        default: false
    },
    seeGradesheet: {
        type: fileSchema,
        required: false
    },
    nebGradesheet: {
        type: fileSchema,
        required: false
    },
    migrationCertificate: {
        type: fileSchema,
        required: false
    },
    provisionalCertificate: {
        type: fileSchema,
        required: false
    },
    characterCertificate: {
        type: fileSchema,
        required: false
    },
    citizenshipDocument: {
        type: fileSchema,
        required: false
    },
    gapCertificate: {
        type: fileSchema,
        required: false
    },
    assignedReviewerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: false
    },
    reviewerRemarks: {
        type: String,
        required: false
    }
});


const AdmissionModel = mongoose.model("Admission", admissionSchema);

module.exports = AdmissionModel