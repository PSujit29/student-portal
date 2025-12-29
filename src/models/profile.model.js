const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        min: 1,
        max: 50,
        required: true
    },
    profilePic: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        max: 100,
    }

}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true
});

const ProfileModel = mongoose.model("Profile", profileSchema);

module.exports = ProfileModel