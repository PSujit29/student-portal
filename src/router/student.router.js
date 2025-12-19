const stuRouter = require("express").Router()

const StudentController = require("../controllers/student.controller")
const stuCtrl = new StudentController

stuRouter.post("/", stuCtrl.admitStudent)

stuRouter.route('/:id')
    .get(stuCtrl.getStudentDetail)
    .put(stuCtrl.updateStudentDetail)
    .delete(stuCtrl.deleteStudentDetail)

module.exports=stuRouter