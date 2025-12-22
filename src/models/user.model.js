const mongoose = require("mongoose");
 
// _id, name, email, password, gender, role, phone, aprofilePicture, address, dob,createdAt, updatedAt
const userSchema = new mongoose.Schema({
    
});


const userModel = mongoose.model("User", userSchema);

module.exports = userModel
