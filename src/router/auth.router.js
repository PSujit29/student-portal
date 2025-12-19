const authRouter = require("express").Router()
const AuthController = require("../controllers/auth.controller")

const authCtrl = new AuthController

authRouter.post("/register", authCtrl.registerUser)
authRouter.get("/activate/:userID", authCtrl.activateUser)
authRouter.post("/login", authCtrl.loginUser)
authRouter.get("/logout", authCtrl.logoutUser)

module.exports = authRouter 