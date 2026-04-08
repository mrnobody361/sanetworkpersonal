const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    awardMiles: { type: Number, default: 0 },
    statusMiles: { type: Number, default: 0 },
    tier: { type: String, default: 'MEMBER' },
    flightHistory: [{
        flightNo: String,
        airline: String,
        milesEarned: Number,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('User', UserSchema);
