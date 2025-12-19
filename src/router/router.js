const router = require("express").Router()

const frontRouter = require('./front.router.js')
const authRouter = require("./auth.router.js")
const stuRouter = require("./student.router.js")

router.use(frontRouter)
router.use("/auth", authRouter)
router.use("/profile", stuRouter)

module.exports = router
