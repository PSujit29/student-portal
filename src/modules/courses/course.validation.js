const Joi = require("joi");
const { CourseStatus } = require("../../shared/utils/constants");

// Validation for creating a new course
const createCourseRules = Joi.object({
    courseCode: Joi.string().trim().required(),
    courseTitle: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    creditHours: Joi.number().integer().min(0).max(5).required(),
    status: Joi.string()
        .valid(...Object.values(CourseStatus))
        .default(CourseStatus.ACTIVE)
        .optional(),
});

// Validation for updating an existing course
const updateCourseRules = Joi.object({
    courseCode: Joi.string().trim().optional(),
    courseTitle: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    creditHours: Joi.number().integer().min(0).max(5).optional(),
    status: Joi.string()
        .valid(...Object.values(CourseStatus))
        .optional(),
}).min(1);

// Validation for updating only the status field
const updateStatusRules = Joi.object({
    status: Joi.string()
        .valid(...Object.values(CourseStatus))
        .required(),
});

module.exports = {
    createCourseRules,
    updateCourseRules,
    updateStatusRules,
};