const nodemailer = require("nodemailer")
const { smtpConfig } = require("../config/app.config")

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
            throw { code: 500, message: "email sendig error", status: "MAIL_SEND_ERR" }
        }
    }
}

module.exports = new EmailService()