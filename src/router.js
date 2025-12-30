const router = require("express").Router()

const authRouter = require("./auth.router.js")
const stuRouter = require("./student.router.js")
const admisRouter = require("./admission.router.js")


router.use("/auth", authRouter)
router.use("/profile", stuRouter)
router.use("/admission", admisRouter)

module.exports = router
