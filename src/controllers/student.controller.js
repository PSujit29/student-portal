class StudentController {
    //route: studentportal/profile/

    async getMyProfile(req, res, next) {
        // student get /me 
        try {
            // let user = req.loggedInUser;
            // console.log({ user })

            res.json({
                success: true,
                message: 'getMyProfile stub',
                data: null,
                status: 'TEST_GET_MY_PROFILE'
            });
        } catch (err) {
            next(err);
        }
    }

    async updateMyProfile(req, res, next) {
        //student put /me
        try {
            res.json({
                success: true,
                message: 'updateMyProfile stub',
                data: null,
                status: 'TEST_UPDATE_MY_PROFILE'
            });
        } catch (err) {
            next(err);
        }
    }

    async getAllStudents(req, res, next) {
        // admin get '/'
        try {
            res.json({
                success: true,
                message: 'getAllStudents stub',
                data: null,
                status: 'TEST_GET_ALL_STUDENTS'
            });
        } catch (err) {
            next(err);
        }
    }

    async getStudentDetail(req, res, next) {
        // admin get /:studentId
        try {
            res.json({
                success: true,
                message: 'getStudentDetail stub',
                data: null,
                status: 'TEST_GET_STUDENT_DETAIL'
            });
        } catch (err) {
            next(err);
        }
    }

    async updateStudentByAdmin(req, res, next) {
        // admin patch /:studentId
        try {
            res.json({
                success: true,
                message: 'updateStudentByAdmin stub',
                data: null,
                status: 'TEST_UPDATE_STUDENT_BY_ADMIN'
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteStudentByAdmin(req, res, next) {
        // admin delete /:studentId
        try {
            res.json({
                success: true,
                message: 'deleteStudentByAdmin stub',
                data: null,
                status: 'TEST_DELETE_STUDENT_BY_ADMIN'
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StudentController();
