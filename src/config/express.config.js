const express = require('express')

const router = require('../router/router.js')
const errorHanlder = require("../middlewares/error-handling.middleware");
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/studentportal/v1', router)
app.use((req, res, next) => {
    next({ code: 404, message: "page not found", status: "PAGE_NOT_FOUND_ERR" })
})
app.use(errorHanlder)
module.exports = app
