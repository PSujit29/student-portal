const { dbConfig } = require('./app.config');

const mongoose = require('mongoose');

(async () => {
    try {
        await mongoose.connect(dbConfig.mongodbUrl, {
            dbName: dbConfig.mongodbName,
            autoCreate: true,
            autoIndex: true
        })
        console.log("*** MongoDB is connected successfully ***")
    } catch (exception) {
        console.log("*** MongoDB connection failed ***", exception.message)
        throw { code: 500, message: "MongoDB Connection failed", status: "MONGOBD_CONNECTION_ERROR" }
    }
})();
