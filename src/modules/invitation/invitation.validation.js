const Joi = require("joi");

const inviteRules = Joi.object({
    email: Joi.string().email().required(),
    fullName: Joi.string().required(),

    // must handle multiple department or single department as input
    department: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional()
})

module.exports = {
    inviteRules
}