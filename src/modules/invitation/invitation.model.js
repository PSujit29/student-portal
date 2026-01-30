const mongoose = require("mongoose");
const { createBaseSchema } = require("../../shared/models/base.model");

const invitationSchema = createBaseSchema({
    email: { type: String, required: true, lowercase: true, trim: true },
    token: { type: String, required: true, unique: true },

    // Store pre-filled data here until they register
    metadata: {
        fullName: { type: String, required: true },
        department: [{ type: String }],
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Expired'],
        default: 'Pending',
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        // Keep the record for 7 days after expiry for admin visibility
        // Only use index { expires: 0 } if you want it to disappear instantly
    },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
    {
        timestamps: true,
        createdBy: true,
        updatedBy: true,
    }
);

const InvitationModel = mongoose.model("Invitation", invitationSchema);

module.exports = InvitationModel;


/*
 Workflow
{more required
/*
workflow suggestion for teachers side
1. Initial Invitation
    Check Email: Locate the invitation link sent by your school admin to your registered email address.
    Start Onboarding: Click the "Complete Onboarding" button within that email to be redirected to the portal.

2. Registration & Account Setup
    Verify Bio-Data: Review the pre-filled information (Email, School Name, Full Name, and Class).
    Complete Profile: Manually enter your phone number and create a secure password.
    Create Account: Click "Create Account" to trigger the success message.

3. Activation (Troubleshooting)
    Verification Check: If the system says your account isn't active, return to your inbox for a verification email.
    Confirm Email: Click the verification link in that email to reach your dashboard.

4. Logging In
    Credentials: Enter your email address and password on the Login Page.
    Access Dashboard: Click "Login" to enter the teacher's management area.

<!--  My question: What is workflow for the admin side from beginning till the initial invitation is sent? the mongodb models required, their short contents, and the sample example -->
*}
*/