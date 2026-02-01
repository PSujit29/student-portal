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
        const inviteLink = `http://localhost:5173/register/:${token}`; // TODO:Update with frontend URL later
        
        const message = `
        <h1>Hello, ${fullName}!</h1>
        <p>You have been invited to join the Teacher's Side of student portal platform.</p>
        <p>Please click the link below to complete your registration:</p>
        <a href="${inviteLink}">Accept Invite</a>
        <p>This link will expire soon.</p>
    `;

        return await this.sendEmail({
            to: email,
            from: smtpConfig.from,
            subject: "Teacher Invitation",
            message: message
        });
    }
    
}

module.exports = new EmailService()