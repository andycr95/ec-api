const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {type: String, required: true, lowercase: true},
    email : {type: String, required: true, unique: true, lowercase: true},
    typeUser : {type: String},
    password : {type: String, required: true},
    phoneNumber : {type: String}
}, {
    timestamps: true
});

userSchema.methods.encriptPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

userSchema.methods.matchPassword = async function (password) {
   return await bcrypt.compare(password, this.password);
} 


module.exports = mongoose.model('user', userSchema );