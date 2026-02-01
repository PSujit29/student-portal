const jwt = require("jsonwebtoken");
const { AppConfig } = require("../../config/app.config");
const UserModel = require("../models/user.model");
const ProfileModel = require("../../modules/profiles/profile.model");

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

            // Ensure the user has a profile; create an empty one if missing
            let profile = await ProfileModel.findOne({ userId: userDetail._id });
            if (!profile) {
                profile = await ProfileModel.create({
                    userId: userDetail._id,
                    fullName: userDetail.name || userDetail.email || "",
                });
            }

            req.loggedInUser = {
                _id: userDetail._id,
                profileId: profile._id,
                name: userDetail.name,
                email: userDetail.email,
                role: userDetail.role,
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