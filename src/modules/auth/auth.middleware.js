const jwt = require("jsonwebtoken");
const { AppConfig } = require("../../config/app.config");
const UserModel = require("../../shared/models/user.model");

const checkLogin = function (allowedRoles = null) {
    return async (req, res, next) => {
        try {
            const tokenWithBearer = req.headers["authorization"] || null
            if (!tokenWithBearer) {
                throw { code: 401, message: "Bearer token not found", status: "TOKEN_REQUIRED" }
            }

            let token = tokenWithBearer.replace("Bearer ", "");

            const data = jwt.verify(token, AppConfig.jwtSecret) //token data
            if (data.type !== 'Bearer') {
                throw { code: 401, message: "Not a bearer token", status: "INVALID_TOKEN_TYPE" }
            }

            const userDetail = await UserModel.findOne({ _id: data.sub });
            if (!userDetail) {
                throw { code: 402, message: "user not found", status: "USER_NOT_FOUND" }

            }

            req.loggedInUser = {
                _id: userDetail._id,
                name: userDetail.name,
                email: userDetail.email,
                role: userDetail.role,
                // Map the email verification status to the isActive flag exposed on the request
                isActive: userDetail.isEmailVerified,
            }

            if (!userDetail.isEmailVerified) {
                throw { code: 403, message: "Account not activated", status: "ACCOUNT_INACTIVE" }
            }

            if (!allowedRoles) {
                return next();
            }

            const userRole = req.loggedInUser?.role;
            if (allowedRoles.includes(userRole)) {
                return next();
            } else {
                throw { code: 403, message: "Forbidden: You do not have the required permissions.", status: "NOT_ALLOWED" }
            }

        } catch (exception) {
            // console.log(exception)
            next(exception)
        }
    }

};

module.exports = checkLogin