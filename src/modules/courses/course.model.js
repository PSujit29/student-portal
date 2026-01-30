const mongoose = require('mongoose');
const { createBaseSchema } = require('../../shared/models/base.model');
const { CourseStatus } = require("../../shared/utils/constants");

const courseSchema = createBaseSchema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
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
        min: 1,
    },
    status: {
        type: String,
        enum: Object.values(CourseStatus),
        default: CourseStatus.ACTIVE,
    },

});

courseSchema.index({ status: 1 });

const CourseModel = mongoose.model("Course", courseSchema);

module.exports = CourseModel