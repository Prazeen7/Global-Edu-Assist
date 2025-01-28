const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user: {type:String, required: true}
});


const UserModel = mongoose.model("registerUser", UserSchema)
module.exports = UserModel