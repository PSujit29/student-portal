class AuthController {

    // handle user registration
    registerUser = (req, res, next) => {
        let data = req.body;
        

        res.json({
            data: { data },
            message: "user register success",
            status: "TEST_REGISTER_USER"
        })
    }
    activateUser = (req, res, next) => {
        let params = req.params
        let query = req.query
        res.json({
            data: {
                params,
                query
            },
            message: `user activated for uid ${params.userID}`,
            status: "TEST_ACTIVATe_USER"
        })
    }
    loginUser = (req, res, next) => {
        res.json({
            data: null,
            message: "test login user",
            status: "TEST_LOGIN_USER"
        })
    }
    logoutUser = (req, res, next) => {
        res.json({
            data: null,
            message: "test logout user",
            status: "TEST_LOGOUT_USER"
        })
    }
    getLoggedInUser = (req, res, next) => {
        res.json({
            data: null,
            message: "test get logged in user",
            status: "TEST_GET_LOGGED_IN_USER"
        })
    }
}


module.exports = AuthController