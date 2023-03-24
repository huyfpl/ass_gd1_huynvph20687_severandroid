const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    color: String
});

let Clothes = mongoose.model('Clothes', userSchema);

module.exports = { Clothes };