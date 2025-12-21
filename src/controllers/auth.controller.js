const bcrypt = require('bcryptjs')
class AuthController {

    // handle user registration
    registerUser = (req, res, next) => {
        let data = req.body;
        if(req.file){
            data.image = req.file //adding filename to the data 
        }

        if(data.password !== data.confirmPassword){
            return res.status(400).json({
                data: null,
                message: "password and confirm password do not match",
                status: "REGISTER_PASSWORD_MISMATCH"
            })
        }

        data.password = bcrypt.hashSync(data.password, 12) //passwordhash
        delete data.confirmPassword // remove onfirm passwod from the data

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