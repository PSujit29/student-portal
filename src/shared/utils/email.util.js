const nodemailer = require("nodemailer")
const { smtpConfig } = require("../../config/app.config")

class EmailService {
    #transport;
    constructor() {
        try {
            this.#transport = nodemailer.createTransport({
                service: "gmail",
                host: smtpConfig.host,
                port: smtpConfig.port,
                auth: {
                    user: smtpConfig.user,
                    pass: smtpConfig.password
                }
            });
            console.log(" *** SMTP server connected ***")

        }
        catch (exception) {
            throw { code: 500, message: "server connection failed", status: "SMTP_CONNECTION_ERR" }
        }
    }

    async sendEmail({ to, subject, message, attachments = null, cc = null, bcc = null }) {
        try {
            let messageObject = {
                to: to,
                from: smtpConfig.from,
                subject: subject,
                html: message,
            }
            if (cc) {
                messageObject['cc'] = cc
            }
            if (bcc) {
                messageObject['bcc'] = bcc
            }
            if (attachments) {
                messageObject['attachments'] = attachments
            }
            return await this.#transport.sendMail(messageObject);
        }
        catch (exception) {
            // console.log(exception)
            throw { code: 500, message: "email sending error", status: "MAIL_SEND_ERR" }
        }
    }

    async sendInvite(email, token, fullName) {
        const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const inviteLink = `${frontendBaseUrl}/complete-onboarding?token=${token}`;

        const message = `
        <div style="font-family: sans-serif; line-height: 1.5;">
            <h1>Hello, ${fullName}!</h1>
            <p>You have been invited to join the <strong>Teacher's Portal</strong>.</p>
            <p>Please click the button below to complete your registration:</p>
            <a href="${inviteLink}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Complete Registration
            </a>
            <p style="color: #666; font-size: 0.8em; margin-top: 20px;">
                This link will expire in 24 hours. If you did not expect this invitation, please ignore this email.
            </p>
        </div>
    `;

        return await this.sendEmail({
            to: email,
            from: smtpConfig.from,
            subject: "Action Required: Complete Your Teacher Registration",
            message: message
        });
    }


}

module.exports = new EmailService()