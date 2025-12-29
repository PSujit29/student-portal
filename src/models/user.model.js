const mongoose = require("mongoose");
const { UserRoles } = require("../config/constants.config");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: Object.values(UserRoles),
        default: UserRoles.STUDENT,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    lastLoginAt: {
        type: Date,
        default: null,
    },
    failedLoginCount: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },

}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
});

// Ensure email uniqueness only for non-deleted users
userSchema.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel
