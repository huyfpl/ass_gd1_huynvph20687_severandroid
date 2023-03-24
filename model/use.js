const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    avatar: String,
    name: String,
    email: String,
    password: String
});

let User = mongoose.model('users', userSchema);

module.exports = { User };