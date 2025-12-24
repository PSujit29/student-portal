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
    "password": Joi.string().min(8).required(true)
})

const loginRules = Joi.object({
    "email": Joi.string().email().required(true),
    "password": Joi.string().min(8).required(true)
})

authRouter.post("/register",bodyValidator(registerRules), authCtrl.registerUser)
authRouter.post("/login", bodyValidator(loginRules), authCtrl.loginUser)
authRouter.get("/activate/:userID", checkLogin(),authCtrl.activateUser)
authRouter.get("/logout", authCtrl.logoutUser)

authRouter.get('/me', authCtrl.getLoggedInUser)

module.exports = authRouter 