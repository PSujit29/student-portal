const mongoose = require('mongoose');
const { createBaseSchema } = require('./base.model');
const { Programme, CourseCategory } = require("../utils/constants");

const programmeCourseSchema = createBaseSchema({
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
        default: null,
        trim: true,
        minlength: 1,
        maxlength: 32,
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

    // optional prerequisites for this curriculum slot
    prerequisiteCourseIds: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Course',
        },
    ],

    // allow overriding default course credits per programme/semester if needed
    creditsOverride: {
        type: Number,
        min: 0,
        default: null,
    },

});

programmeCourseSchema.index({ programme: 1, semester: 1, courseId: 1 }, { unique: true });
programmeCourseSchema.index({ programme: 1, semester: 1 });

// Ensure electiveGroup is only set for elective courses
programmeCourseSchema.pre('validate', function (next) {
    if (!this.isElective && this.electiveGroup) {
        return next(new Error('electiveGroup can only be set when isElective is true'));
    }
    next();
});
const ProgrammeCourseModel = mongoose.model("ProgrammeCourse", programmeCourseSchema);

module.exports = ProgrammeCourseModel