const Joi = require("joi");
const { Genders, Designation, Programme } = require("../../shared/utils/constants");

const inviteRules = Joi.object({
    email: Joi.string().email().required(),
    fullName: Joi.string().required(),

    // must handle multiple department or single department as input
    department: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional()
})

const registerRules = Joi.object({

    //prefill
    email: Joi.string().trim().email().max(255).optional(),
    password: Joi.string().min(8).max(255).required(),
    
    //mustfill
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    fullName: Joi.string().trim().min(1).max(128).optional(),
    gender: Joi.string().valid(...Object.values(Genders)).required(),
    phone: Joi.string().trim().pattern(/^\+?[0-9]{7,15}$/).required(),
    address: Joi.string().trim().min(1).max(256).required(),
    dob: Joi.date().less('now'),
    designation: Joi.string().valid(...Object.values(Designation)).optional(),
    department: Joi.alternatives().try(
        Joi.array().items(Joi.string().valid(...Object.values(Programme))),
        Joi.string().valid(...Object.values(Programme))
    ).optional()
    
})

module.exports = {
    inviteRules,
    registerRules
}