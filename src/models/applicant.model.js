const mongoose = require("mongoose");
const { Genders } = require("../config/constants.config");

const applicantSchema = new mongoose.Schema({

    /*
    i think we can somehow access user name and email already during
    appllication process as user have first registered vaguely just by gmail
    */
    // name: {
    //     type: String,
    //     min: 2,
    //     max: 50,
    //     required: true,
    // },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // password: {
    //     type: String,
    //     required: true,
    //     min: 8
    // },
    // applicantID: ref(user), //?
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    gender: {
        type: String,
        enum: Object.values(Genders),
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    // i think the role is alredy fixed to applicant so no need for the role 
    // role: {
    //     type: String,
    //     enum: Object.values(userRoles),
    //     default: userRoles.STUDENT,
    //     required: true
    // },
    address: {
        type: String,
        min: 2,
        max: 200,
        required: true
    },
    dob: Date,
    // image: String, // may be its too early??


    //what others can i add for admissions??

}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});


const applicantModel = mongoose.model("Applicant", applicantSchema);

module.exports = applicantModel
