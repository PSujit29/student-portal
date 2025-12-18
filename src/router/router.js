const router = require("express").Router()
const frontRouter = require('./front.router.js')

router.use(frontRouter)

module.exports = router
