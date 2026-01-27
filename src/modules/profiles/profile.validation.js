const Joi = require("joi");
const { Genders, BloodGroups } = require("../../shared/utils/constants");

const phoneSchema = Joi.string().pattern(/^\+?[0-9]{7,15}$/).default(null).allow(null);
const uriNullable = Joi.string().uri().default(null).allow(null);

const updationRules = Joi.object({

  phone: phoneSchema.optional().allow(null),
  temporaryAddress: Joi.string().min(1).max(150).optional().allow(null),
  emergencyContactName: Joi.string().min(1).max(100).optional().allow(null),
  emergencyPhone: phoneSchema.optional().allow(null),
  profilePic: uriNullable.optional().allow(null),
  bio: Joi.string().max(250).optional().allow(null),
  bloodGroup: Joi.string().valid(...Object.values(BloodGroups)).optional().default(null).allow(null),
  nationality: Joi.string().min(4).max(56).default(null).allow(null),


}).min(1).unknown(false);

const creationRules = Joi.object({

  //required fields for admin to provide during creation
  userId : Joi.string().hex().length(24).required(),
  fullName: Joi.string().min(1).max(100).required(),
  gender: Joi.string().valid(...Object.values(Genders)).required(),
  phone: phoneSchema.required(),
  permanentAddress: Joi.string().max(100).required(),
  dob: Joi.date().max("now").min("1920-01-01").required(),
  
  //these fields are not provided during creation. (default null), but can be added later (we allow updation in backend)
  temporaryAddress: Joi.string().min(1).max(150).optional().default(null).allow(null),
  emergencyContactName: Joi.string().min(1).max(100).optional().default(null).allow(null),
  emergencyPhone: phoneSchema.optional().default(null).allow(null),
  profilePic: uriNullable.optional().default(null).allow(null),
  bio: Joi.string().max(250).optional().default(null).allow(null),
  nationality: Joi.string().min(4).max(56).default(null).allow(null),
  bloodGroup: Joi.string().valid(...Object.values(BloodGroups)).optional().default(null).allow(null),
});

module.exports = {
  updationRules,
  creationRules,
};