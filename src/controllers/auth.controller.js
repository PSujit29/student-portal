const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const emailService = require("../services/mail.service");
const { AppConfig, FRONTEND_URL } = require("../config/app.config");
const jwt = require("jsonwebtoken");
const { generateActivationToken } = require('../utility/token');
require("dotenv").config()

class AuthController {

    // handle user registration
    async registerUser(req, res, next) {
        let data = req.body;
        data.password = bcrypt.hashSync(data.password)
        // i guess user role is default to applicant at this phaase while storing in database.
        const user = new userModel(data)
        const savedUser = await user.save()

        const token = generateActivationToken(user);

        const activationLink =
            `${FRONTEND_URL}/activate?token=${token}`;

        const html = `
  <h2>Activate your account</h2>
  <p>Hello ${user.name},</p>
  <p>Click the button below to activate your account:</p>
  <a href="${activationLink}"
     style="padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;">
     Activate Account
  </a>
  <p>This link expires in 15 minutes.</p>
`;

        await emailService.sendEmail({
            to: user.email,
            subject: 'Activate your account',
            message: html
        });


        res.json({
            data: {
                _id: savedUser._id,
                name: savedUser.name
            },
            message: "user register success",
            status: "TEST_REGISTER_USER"
        })
    }

    async activateUser(req, res, next) {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ message: 'Activation token required' });
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.ACTIVATION_SECRET);
        } catch {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        if (payload.type !== 'activation') {
            return res.status(403).json({ message: 'Invalid token type' });
        }

        const user = await userModel.findById(payload.uid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isActive) {
            return res.json({ message: 'Account already activated' });
        }

        user.isActive = true;
        await user.save();

        res.json({ message: 'Account activated successfully' });
    };


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
            data: req.loggedInUser,
            message: "test get logged in user",
            status: "TEST_GET_LOGGED_IN_USER"
        })
    }
}


module.exports = AuthController