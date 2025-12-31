const router = require("express").Router()

const authRouter = require("./modules/auth/auth.routes.js")
const courseRouter = require("./modules/courses/course.routes.js")
const stuRouter = require("./modules/students/student.routes.js")


router.use("/auth", authRouter)
router.use("/profile", stuRouter)
router.use("/course", courseRouter)

module.exports = router
