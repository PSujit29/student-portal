const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../../shared/models/user.model');
const emailService = require('../../shared/utils/email.util');
const { AppConfig, FRONTEND_URL } = require('../../config/app.config');
const { generateActivationToken } = require('../../shared/utils/token.util');
const ProfileModel = require('../profiles/profile.model');

class AuthService {

	async getActivationTemplate(name, email, token) {
		const activationLink = `${FRONTEND_URL}/activation-redirect.html?token=${token}`;

		return `
        <h2>Activate your account</h2>
        <p>Hello ${name || email},</p>
        <p>Click the button below to activate your account:</p>
        <a href="${activationLink}" 
           style="padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;">
           Activate Account
        </a>
        <p>This link expires in 15 minutes.</p>
    `;
	};
	
	async sendActivationEmail(user, name) {
		//separate logic to send activation email
		try {
			const token = generateActivationToken(user);
			const htmlContent = await this.getActivationTemplate(name, user.email, token);
			// await emailService.sendEmail({
			// 	to: user.email,
			// 	subject: 'Activate your account',
			// 	message: htmlContent,
			// });
			console.log(token); //TODO: only for dev purpose to remove later
			// console.log(`Activation email sent to ${user.email}`);
		} catch (error) {
			console.error('Failed to send activation email:', error);
			throw new Error('EMAIL_SEND_FAILURE');
		}
	}

	async register({ name, email, password }) {
		// 1. Validation Logic
		const existingUser = await UserModel.findOne({ email, isDeleted: false });
		if (existingUser) {
			throw {
				code: 409,
				message: 'User already exists with this email',
				status: 'USER_ALREADY_EXISTS',
			};
		}

		const hashedPassword = bcrypt.hashSync(password, 10);

		const user = new UserModel({
			email,
			password: hashedPassword,
		});

		const savedUser = await user.save();

		await ProfileModel.create({
			userId: savedUser._id,
			fullName: name || '',
		});

		await this.sendActivationEmail(savedUser, name);

		return {
			user: savedUser,
			displayName: name || email,
		};
	}

	async activateAccount(token) {
		if (!token) {
			throw { code: 400, message: 'Activation token required', status: 'ACTIVATION_TOKEN_REQUIRED' };
		}

		let payload;
		try {
			payload = jwt.verify(token, process.env.ACTIVATION_SECRET);
		} catch (e) {
			throw { code: 401, message: 'Invalid or expired token', status: 'INVALID_OR_EXPIRED_TOKEN' };
		}

		if (payload.type !== 'activation') {
			throw { code: 403, message: 'Invalid token type', status: 'INVALID_TOKEN_TYPE' };
		}

		const user = await UserModel.findById(payload.uid);
		if (!user) {
			throw { code: 404, message: 'User not found', status: 'USER_NOT_FOUND' };
		}

		if (user.isEmailVerified) {
			return { alreadyActivated: true };
		}

		user.isEmailVerified = true;
		await user.save();

		return { alreadyActivated: false };
	}

	async login({ email, password }) {
		const user = await UserModel.findOne({ email, isDeleted: false });
		if (!user) {
			throw { code: 404, message: 'User not found', status: 'USER_NOT_FOUND' };
		}

		if (!user.isEmailVerified) {
			throw {
				code: 400,
				message: 'Activate your account first',
				status: 'USER_NOT_ACTIVATED',
			};
		}

		const isMatch = bcrypt.compareSync(password, user.password);
		if (!isMatch) {
			throw { code: 422, message: 'Credentials do not match', status: 'CREDENTIAL_NOT_MATCHED' };
		}

		const accessToken = jwt.sign(
			{ sub: user._id, type: 'Bearer' },
			AppConfig.jwtSecret,
			{ expiresIn: '60d' },
		);

		return { accessToken };
	}
}

module.exports = new AuthService();

