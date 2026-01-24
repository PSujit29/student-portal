const Joi = require("joi");
const { NonActiveStatuses } = require("../../shared/utils/constants");

const deletionRules = Joi.object({
    reason: Joi.string().valid(...Object.values(NonActiveStatuses)).required(true)
}).unknown(true);

const creationRules = Joi.object({
    userId: Joi.string().hex().length(24).required()
        .messages({ "string.length": "Invalid User ID format" }),

    programme: Joi.string().uppercase().min(2).max(10).required()
        .messages({ "any.required": "Programme (e.g., CS, BBA) is required" }),

    batch: Joi.string().pattern(/^[0-9]{4}$/).required()
        .messages({ "string.pattern.base": "Batch must be a 4-digit year" }),

    currentSemester: Joi.number().integer().min(1).max(12).default(1),

    status: Joi.string()
        .valid('active', 'probation', 'graduated', 'withdrawn')
        .default('active'),

    expectedGraduationDate: Joi.date().greater('now').optional()
        .messages({ "date.greater": "Graduation date must be in the future" })

}).unknown(false);

module.exports = {
    deletionRules,
    creationRules
}