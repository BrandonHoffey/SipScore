const mongoose = require('mongoose');

const userWhiskeySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    whiskeys: [
        {
            whiskeyId: { type: mongoose.Schema.Types.ObjectId, ref: 'whiskey', required: true },
        }
    ]
})

module.exports = mongoose.model('UserWhiskey', userWhiskeySchema, 'User Whiskey');