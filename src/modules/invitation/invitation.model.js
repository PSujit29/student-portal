const mongoose = require("mongoose");
const { createBaseSchema } = require("../../shared/models/base.model");

const invitationSchema = createBaseSchema({
    email: { type: String, required: true, lowercase: true, trim: true },
    token: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    department: [{ type: String }],
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Expired'],
        default: 'Pending',
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
    {
        timestamps: true,
        createdBy: true,
        updatedBy: true,
    }
);
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const InvitationModel = mongoose.model("Invitation", invitationSchema);

module.exports = InvitationModel;

