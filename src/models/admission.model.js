const mongoose = require("mongoose");
const { ApplicationStatus } = require("../config/constants.config");


const admissionSchema = new mongoose.Schema({
    applicantId: {
        type: mongoose.Types.ObjectId,
        ref: "Applicant",
        required: true
    },
    status: {
        type: String,
        enum: Object.values(ApplicationStatus),
        default: ApplicationStatus.UNDER_REVIEW
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


const ApplicationModel = mongoose.model("Admission", admissionSchema);

module.exports = ApplicationModel
