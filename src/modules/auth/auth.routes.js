const authRouter = require('express').Router();

const AuthController = require('./auth.controller');
const checkLogin = require('./auth.middleware');
const bodyValidator = require('../../shared/middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('./auth.validation');

const authCtrl = new AuthController();

authRouter.post('/register', bodyValidator(registerSchema), authCtrl.registerUser);
authRouter.post('/login', bodyValidator(loginSchema), authCtrl.loginUser);
authRouter.get('/activate', authCtrl.activateUser);
authRouter.get('/logout', authCtrl.logoutUser);

authRouter.get('/me', checkLogin(), authCtrl.getLoggedInUser);

module.exports = authRouter;
