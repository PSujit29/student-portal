const mongoose = require('mongoose');
const { Programme, CourseCategory } = require("../utils/constants");

const programmeCourseSchema = new mongoose.Schema({
    programme: {
        type: String,
        enum: Object.values(Programme),
        required: true,
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8,
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    isElective: {
        type: Boolean,
        default: false,
    },
    electiveGroup: {
        type: String,
        default: null
    },
    category: {
        type: String,
        enum: Object.values(CourseCategory),
        default: CourseCategory.THEORY,
    },
    remarks: {
        type: String,
        default: null,
    },

}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
});
programmeCourseSchema.index({ programme: 1, semester: 1, courseId: 1 }, { unique: true })
const ProgrammeCourseModel = mongoose.model("ProgrammeCourse", programmeCourseSchema);

module.exports = ProgrammeCourseModel