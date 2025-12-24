const mongoose = require("mongoose");
const { applicationStatus } = require("../config/constants.config");


const admissionSchema = new mongoose.Schema({
    applicantId: {
        type: mongoose.Types.ObjectId,
        ref: "Applicant",
        required: true
    },
    applicationId: {
        type: String,
        // required: true,
    },
    status: {
        type: String,
        enum: Object.values(applicationStatus),
        default: applicationStatus.UNDER_REVIEW
    },
    isSubmitted: {
        type: Boolean,
        default: false
    },
    // createdBy: {
    //     type: mongoose.Types.ObjectId,
    //     ref: "applicant",
    //     default: null,
    // },
    // updatedBy: {
    //     type: mongoose.Types.ObjectId,
    //     ref: "applicant",
    //     default: null,
    // }

}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});


const applicationModel = mongoose.model("Admission", admissionSchema);

module.exports = applicationModel
