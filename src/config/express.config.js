const express = require('express')

const router = require('../router/router.js')
const errorHanlder = require("../middlewares/error-handling.middleware");
const app = express()

//body parser
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ limit: "5mb", extended: true }))
app.use("/assets", express.static("./public/uploads"))

app.use('/studentportal/v1', router)

app.use((req, res, next) => {
    next({ code: 404, message: "page not found", status: "PAGE_NOT_FOUND_ERR" })
})

app.use(errorHanlder)
module.exports = app
