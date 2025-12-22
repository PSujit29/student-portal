// load env variables to server
require('dotenv').config()

const dbConfig = {
    mongodbUrl : process.env.MONGODB_URL,
    mongodbName:process.env.MONGODB_NAME
}

module.exports = {
    dbConfig
}