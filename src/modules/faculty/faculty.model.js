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
        enum: Object.values(Programme), 
        trim: true,
    }],

    assignedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default:null,
    }],

    designation: {
        type: String,
        enum: Object.values(Designation),
        required: true,
        trim: true,
    },

    officeHours: {
        type: String,
        default:null,
    },

    qualification: [{
        type: String,
        default:null,
    }],

    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.ACTIVE,
    },
});

facultySchema.index({ department: 1 });

const FacultyModel = mongoose.model("Faculty", facultySchema)

module.exports = FacultyModel