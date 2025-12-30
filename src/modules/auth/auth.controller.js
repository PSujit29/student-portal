const authService = require('./auth.service');

class AuthController {
    async registerUser(req, res, next) {
        try {
            const { name, email, password } = req.body;

            const { user, displayName } = await authService.register({
                name,
                email,
                password,
            });

            res.json({
                data: {
                    _id: user._id,
                    email: user.email,
                    name: displayName,
                },
                message: 'User registered successfully. Please check your email to activate the account.',
                status: 'USER_REGISTER_SUCCESS',
            });
        } catch (err) {
            next(err);
        }
    }

    async activateUser(req, res, next) {
        try {
            const { token } = req.query;
            const { alreadyActivated } = await authService.activateAccount(token);

            if (alreadyActivated) {
                return res.json({
                    message: 'Account already activated',
                    status: 'ACCOUNT_ALREADY_ACTIVATED',
                });
            }

            res.json({
                message: 'Account activated successfully',
                status: 'ACCOUNT_ACTIVATED',
            });
        } catch (err) {
            next(err);
        }
    }

    async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;

            const { accessToken } = await authService.login({ email, password });

            res.json({
                data: accessToken,
                message: 'Logged in successfully',
                status: 'LOGIN_SUCCESS',
            });
        } catch (err) {
            next(err);
        }
    }

    logoutUser = (req, res, next) => {
        res.json({
            data: null,
            message: 'Logout endpoint (no server-side session to destroy)',
            status: 'LOGOUT_SUCCESS',
        });
    };

    getLoggedInUser = (req, res, next) => {
        res.json({
            data: req.loggedInUser,
            message: 'Fetched logged-in user',
            status: 'GET_LOGGED_IN_USER_SUCCESS',
        });
    };
}

module.exports = AuthController;
