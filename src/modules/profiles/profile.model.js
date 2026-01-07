const mongoose = require('mongoose');
const { createBaseSchema } = require('../../shared/models/base.model');
const UserModel = require('../../shared/models/user.model');

const profileSchema = createBaseSchema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        default: null,
        validate: {
            validator: function (value) {
                if (value === null || value === undefined || value === '') return true;
                // very simple E.164-like validation: optional +, 7-15 digits
                return /^\+?[0-9]{7,15}$/.test(value);
            },
            message: 'Invalid phone number format',
        },
    },
    
    address: {
        type: String,
        default: null,
    },
    profilePic: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: 250,
    }

});

// Ensure we do not keep an active profile for a soft-deleted user
profileSchema.pre('validate', async function (next) {
    if (!this.userId) return next();

    try {
        const user = await UserModel.findById(this.userId).select('isDeleted');
        if (user && user.isDeleted && !this.isDeleted) {
            return next(new Error('Cannot have an active profile for a deleted user'));
        }
        next();
    } catch (err) {
        next(err);
    }
});

const ProfileModel = mongoose.model("Profile", profileSchema);

module.exports = ProfileModel