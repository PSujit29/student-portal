const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const { createBaseSchema } = require('./base.model');
const { UserRoles, AccountStatus } = require("../utils/constants");

const userSchema = createBaseSchema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                // Simple email format validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email format',
        },
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
    accountStatus: {
        type: String,
        enum: Object.values(AccountStatus),
        default: AccountStatus.ACTIVE,
    },

});

// Ensure email uniqueness only for non-deleted users
userSchema.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
);

// Index on role for faster authorization/lookup queries
userSchema.index({ role: 1 });

// Hash password before saving if it has been modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Tie failedLoginCount to account status (simple lockout rule)
userSchema.pre('save', function (next) {
    if (this.failedLoginCount >= 5 && this.accountStatus === AccountStatus.ACTIVE) {
        this.accountStatus = AccountStatus.LOCKED;
    }
    next();
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel
