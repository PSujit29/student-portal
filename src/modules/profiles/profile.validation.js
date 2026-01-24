const Joi = require("joi");

const updateProfileRules = Joi.object({
  phone: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/) // same idea as model validator
    .allow(null, "")
    .optional(),

  address: Joi.string()
    .max(200)
    .allow(null, "")
    .optional(),

  profilePic: Joi.string()
    .uri()
    .allow(null, "")
    .optional(),

  bio: Joi.string()
    .max(250)          // matches schema maxlength
    .allow(null, "")
    .optional(),
})
  .min(1)              // at least one field must be provided
  .unknown(false);     // reject extra unexpected fields
  

module.exports = {
  updateProfileRules,
};