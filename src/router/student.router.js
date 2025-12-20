const stuRouter = require("express").Router()

const StudentController = require("../controllers/student.controller")
const checkLogin = require("../middlewares/auth.middleware")
const stuCtrl = new StudentController

stuRouter.post("/", checkLogin(), stuCtrl.admitStudent)

stuRouter.route('/:id')
    .get(checkLogin(), stuCtrl.getStudentDetail)
    .put(checkLogin(), stuCtrl.updateStudentDetail)
    .delete(checkLogin(), stuCtrl.deleteStudentDetail)

module.exports = stuRouter