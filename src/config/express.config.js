const express = require('express')
require("./database.config.js")
const router = require('../router.js')
const errorHandler = require("../shared/middlewares/error.middleware");
const app = express()

//body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// static files
app.use(express.static("./public"))
app.use("/assets", express.static("./public/uploads"))

app.use('/studentportal/', router)

app.use((req, res, next) => {
    next({ code: 404, message: "page not found", status: "PAGE_NOT_FOUND_ERR" })
})

app.use(errorHandler)
module.exports = app