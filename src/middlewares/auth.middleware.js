const checkLogin = (allowedRoles = null) => {
    return (req, res, next) => {
        next({
            code: 401,
            message: "unauthorizaed",
            status: "UNAUTHORIZED"
        })
    }
}

module.exports = checkLogin