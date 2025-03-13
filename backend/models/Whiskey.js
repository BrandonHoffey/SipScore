const mongoose = require('mongoose');

const whiskeySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    proof: { type: Number, required: true, }
})

module.exports = mongoose.model('Whiskey', whiskeySchema, 'Global Whiskey Collection');