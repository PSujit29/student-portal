class StudentController {
    admitStudent = (req, res, next) => {
        res.json({
            data: null,
            message: "student admit success",
            status: "TEST_ADMIT_STUDENT"
        })
    }

    getStudentDetail = (req, res, next) => {
        let stuID = req.params.id
        res.json({
            data: stuID,
            message: `details for stuID ${stuID}`,
            status: "TEST_GET_STUDENT_DETAIL"
        })
    }

    updateStudentDetail = (req, res, next) => {
        res.json({
            data: null,
            message: "test update student detail",
            status: "TEST_UPDATE_STUDENT_DETAIL"
        })
    }

    deleteStudentDetail = (req, res, next) => {
        res.json({
            data: null,
            message: "test delete student",
            status: "TEST_DELETE_STUDENT"
        })
    }
}


module.exports = StudentController