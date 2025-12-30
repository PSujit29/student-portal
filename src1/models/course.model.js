const mongoose = require('mongoose');
const { CourseStatus } = require("../config/constants.config");

const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    courseTitle: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    creditHours: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: Object.values(CourseStatus),
        default: CourseStatus.ACTIVE,
    },

}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
});

const CourseModel = mongoose.model("Course", courseSchema);

module.exports = CourseModel