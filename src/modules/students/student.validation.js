const updationRules = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{7,10}$/).optional(),
    address: Joi.string().min(1).max(100).optional()
}).min(1).unknown(false);//allow atleast one update else check is pointless and costly

const deletionRules = Joi.object({
    reason: Joi.string().valid(...Object.values(NonActiveStatuses)).required(true)
}).unknown(true);


module.exports = {
    updationRules,
    deletionRules,
}