const mongoose = require("mongoose");
const { userRoles } = require("../config/constants.config");
// const { Genders, userRoles } = require("../config/constants.config");

const userSchema = new mongoose.Schema({
    // _id, name, email, password
    name: {
        type: String,
        min: 2,
        max: 50,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    role:{
        type: String,
        enum: Object.values(userRoles),
        default: userRoles.APPLICANT
    },
    isActive: {
        type:Boolean,
        default:false
    },
    // createdBy: {
    //     type: mongoose.Types.ObjectId,
    //     ref: "user",
    //     default: null,
    // },
    // updatedBy: {
    //     type: mongoose.Types.ObjectId,
    //     ref: "user",
    //     default: null,
    // }

}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});


const userModel = mongoose.model("User", userSchema);

module.exports = userModel
