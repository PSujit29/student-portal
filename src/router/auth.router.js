const authRouter = require("express").Router()
const AuthController = require("../controllers/auth.controller")
const checkLogin = require("../middlewares/auth.middleware")
const uploader = require("../middlewares/uploader.middleware")
const bodyValidator = require("../middlewares/validator.middleware")
const Joi = require("joi")

const authCtrl = new AuthController


const registerRules = Joi.object({
    "name": Joi.string().min(2).max(50).required(true),
    "email": Joi.string().email().required(true),
    "password": Joi.string().min(8).required(true),
    "confirmPassword": Joi.ref("password"),
    "role": Joi.string().valid("teacher", "student", "admin").default('student').required(true),
    "phone": Joi.string().allow("", null).optional().default(null),
    "address": Joi.string().min(2).max(100).required(true),
    "dob": Joi.date()
})

const loginRules = Joi.object({
    "email": Joi.string().email().required(true),
    "password": Joi.string().min(8).required(true)
})

authRouter.post("/register", uploader().single('profilePicture'),bodyValidator(registerRules), authCtrl.registerUser)
authRouter.get("/activate/:userID", authCtrl.activateUser)
authRouter.post("/login", bodyValidator(loginRules), authCtrl.loginUser)
authRouter.get("/logout", authCtrl.logoutUser)

authRouter.get('/me', checkLogin(['admin']), authCtrl.getLoggedInUser)

module.exports = authRouter 