const mongoose = require("mongoose");
const { UserRoles } = require("../config/constants.config");
// const { Genders, UserRoles } = require("../config/constants.config");

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
        enum: Object.values(UserRoles),
        default: UserRoles.APPLICANT
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


const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel
