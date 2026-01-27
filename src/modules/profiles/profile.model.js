const mongoose = require('mongoose');
const { createBaseSchema } = require('../../shared/models/base.model');
const UserModel = require('../../shared/models/user.model');
const { Genders, BloodGroups } = require('../../shared/utils/constants');

const profileSchema = createBaseSchema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        // match: /^[A-Za-z\s'-]+$/,
        minlength: 1,
        maxlength: 100,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: Object.values(Genders),
        required: true,
    },
    phone: {
        type: String,
        match: /^\+?[0-9]{7,15}$/,
        required: true,
    },
    permanentAddress: {
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true,
    },
    dob: {
        type: Date,
        required: true
    },
    emergencyContactName: {
        type: String,
        minlength: 1,
        maxlength: 100,
        default: null,
    },
    emergencyPhone: {
        type: String,
        match: /^\+?[0-9]{7,15}$/,
        default: null,
    },
    address: {
        type: String,
        minlength: 1,
        maxlength: 100,
        default: null,
    },
    profilePic: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: 250,
        default: null,
    },
    nationality: {
        type: String,
        minlength:4, //chad,fiji, etc
        maxlength:56, //great britian and its official name
        default: null,
    },
    bloodGroup: {
        type: String,
        enum: Object.values(BloodGroups),
        default: null,
    },
});

// Ensure we do not keep an active profile for a soft-deleted user
// profileSchema.pre('validate', async function () {
//     if (!this.userId) return;

//     const user = await UserModel.findById(this.userId).select('isDeleted');
//     if (user && user.isDeleted && !this.isDeleted) {
//         throw new Error('Cannot have an active profile for a deleted user');
//     }
// });

const ProfileModel = mongoose.model("Profile", profileSchema);

module.exports = ProfileModel