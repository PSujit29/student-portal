const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const emailService = require("../services/mail.service");
const { AppConfig } = require("../config/app.config");
const jwt = require("jsonwebtoken");

class AuthController {

    // handle user registration
    async registerUser(req, res, next) {
        let data = req.body;
        data.password = bcrypt.hashSync(data.password)
        // i guess user role is default to applicant at this phaase while storing in database.
        const user = new userModel(data)
        const savedUser = await user.save()

        res.json({
            data: {
                _id: savedUser._id,
                name: savedUser.name
            },
            message: "user register success",
            status: "TEST_REGISTER_USER"
        })
    }


    activateUser = (req, res, next) => {
        let params = req.params
        let query = req.query

        const activationLink = `${AppConfig.FRONTEND_URL}/activate/${params.userID}?token=${query.token}`;

        const html = `
            <h2>Activate your account</h2>
            <p>Dear ${query.name || 'User'},</p>
            <p>Thank you for registering with our Student Portal.</p>
            <p>Please click the button below to activate your account for further processing:</p>
            <p>
                <a href="${activationLink}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#ffffff;text-decoration:none;border-radius:4px;">
                    Activate Account
                </a>
            </p>
            <p>If you did not request this, please ignore this email.</p>
        `;

        emailService.sendMail({
            to: query.email,
            subject: 'Activate your Portal account',
            html
        });

        res.json({
            data: {
                params,
                query
            },
            message: `user activated for uid ${params.userID}`,
            status: "TEST_ACTIVATE_USER"
        })
    }

    async loginUser(req, res, next) {
        try {
            // console.log(res.body)
            const { email, password } = req.body

            //user verification
            const userDetail = await userModel.findOne({
                email: email
            })
            if (!userDetail) {
                throw { code: 404, message: "User not found", status: "USER_NOT_FOUND" }
            }

            //password verification
            if (!bcrypt.compareSync(password, userDetail.password)) {
                throw { code: 422, message: "credentials not match", status: "CREDENTIAL_NOT_MACTCHED" }
            }

            //jwt
            const accessToken = jwt.sign({ sub: userDetail._id, type: "Bearer" }, AppConfig.jwtSecret, { expiresIn: "30d" }) 

            res.json({
                data: accessToken,
                message: "Logged in successfully",
                status: "ok",
            })
        }
        catch (exception) {
            // console.log(exception)
            next(exception)
        }
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