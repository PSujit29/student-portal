const admissionRouter = require("express").Router()
const AdmissionController = require("../controllers/admission.controller.js")

const admissionCtrl = new AdmissionController

admissionRouter.post('/register', admissionCtrl.register)
admissionRouter.post ('/apply', admissionCtrl.apply)


module.exports = admissionRouter