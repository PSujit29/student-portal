const router = require("express").Router()

const authRouter = require("./modules/auth/auth.routes.js")
const stuRouter = require("./modules/students/student.routes.js")


router.use("/auth", authRouter)
router.use("/profile", stuRouter)

module.exports = router
