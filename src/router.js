const router = require("express").Router()

const authRouter = require("./modules/auth/auth.routes.js")
const courseRouter = require("./modules/courses/course.routes.js")
const profileRouter = require("./modules/profiles/profile.routes.js")
const studentRouter = require("./modules/students/student.routes.js")   

router.use("/auth", authRouter)
router.use("/profile", profileRouter)
router.use("/course", courseRouter)
router.use("/students", studentRouter)  

module.exports = router
