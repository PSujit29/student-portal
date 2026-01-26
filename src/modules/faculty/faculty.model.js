const mongoose = require("mongoose");
const { createBaseSchema } = require("../../shared/models/base.model");
const { Programme, Designation, Status } = require("../../shared/utils/constants");

const facultySchema = createBaseSchema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    department: [{
        type: String,
        required: true,
        enum: Object.values(Programme), // e.g  "CSIT", "BIT", "BCA"
        trim: true,
    }],

    assignedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', 
    }],
    
    designation: {
        type: String,
        enum: Object.values(Designation),
        required: true,
        trim: true,
    },

    officeHours: {
        type: String, // Text-based for MVP (e.g., "Mon/Wed 2-4 PM")
    },
    qualifications: [{
        type: String, // e.g., "PhD in Computer Science"
    }],
    // ----------------------------------------------
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.ACTIVE,
    },
});

facultySchema.index({ department: 1 });
facultySchema.index({ researchInterests: 1 }); // Index for student searches

const FacultyModel = mongoose.model("Faculty", facultySchema)

module.exports = FacultyModel