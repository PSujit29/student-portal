const admissionRouter = require("express").Router()
const Joi = require("joi")
const { UserRoles, Genders, Programme } = require("../config/constants.config.js")
const AdmissionController = require("../controllers/admission.controller.js")
const checkLogin = require("../middlewares/auth.middleware.js")
const bodyValidator = require("../middlewares/validator.middleware")


const admissionCtrl = new AdmissionController

const applicationRules = Joi.object({
    "gender": Joi.string().valid(...Object.values(Genders)).default(null),
    "phone": Joi.string().default(null),
    "address": Joi.string().min(2).max(200).required(true),
    "dob": Joi.date().required(true),
    "programme":Joi.string().valid(...Object.values(Programme))
})

admissionRouter.post('/apply', checkLogin([UserRoles.APPLICANT]), bodyValidator(applicationRules), admissionCtrl.apply)
admissionRouter.get('/my-application', checkLogin(), admissionCtrl.getMyApplicationStatus)

module.exports = admissionRouter