const Joi = require("joi");
const { Genders, Designation, Programme, UserRoles } = require("../../shared/utils/constants");

const inviteRules = Joi.object({
    email: Joi.string().email().required(),
    fullName: Joi.string().required(),
    role: Joi.string().valid(...Object.values(UserRoles)).required(),
    department: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional(),
    programme: Joi.string().optional().valid(...Object.values(Programme))
})

const registerRules = Joi.object({

    //prefill
    email: Joi.string().trim().email().max(255).optional(),
    fullName: Joi.string().trim().min(1).max(128).optional(),
    department: Joi.alternatives().try(
        Joi.array().items(Joi.string().valid(...Object.values(Programme))),
        Joi.string().valid(...Object.values(Programme))
    ).optional(),

    //mustfill
    password: Joi.string().min(8).max(255).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    gender: Joi.string().valid(...Object.values(Genders)).required(),
    phone: Joi.string().trim().pattern(/^\+?[0-9]{7,15}$/).required(),
    address: Joi.string().trim().min(1).max(256).required(),
    dob: Joi.date().less('now').required(),
    designation: Joi.string().valid(...Object.values(Designation)).optional(), //optional for faculty, it is default to Lecturer
})

module.exports = {
    inviteRules,
    registerRules
}