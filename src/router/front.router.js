const frontRouter = require("express").Router()
const FrontController = require("../controllers/front.controller")

const frontCtrl = new FrontController

frontRouter.get("/", frontCtrl.homeRequest)
frontRouter.post("/", frontCtrl.handleHomeRequest)

module.exports = frontRouter