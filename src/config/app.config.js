// load env variables to server
require('dotenv').config()

const dbConfig = {
    mongodbUrl : process.env.MONGODB_URL,
    mongodbName:process.env.MONGODB_NAME
}

const smtpConfig = {
  host: process.env.SMTP_HOST,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  port: process.env.SMTP_PORT,
  from: process.env.SMTP_FROM
}

module.exports = {
    dbConfig,
    smtpConfig
}