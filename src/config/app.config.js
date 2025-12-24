// load env variables to server
require('dotenv').config()

const dbConfig = {
  mongodbUrl: process.env.MONGODB_URL,
  mongodbName: process.env.MONGODB_NAME
}
const AppConfig = {
  jwtSecret: process.env.JWT_SECRET,
  appUrl: process.env.APP_URL,
};

const smtpConfig = {
  host: process.env.SMTP_HOST,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  port: process.env.SMTP_PORT,
  from: process.env.SMTP_FROM
}
const FRONTEND_URL = "http://localhost:9005";

module.exports = {
  dbConfig,
  smtpConfig,
  FRONTEND_URL,
  AppConfig
}