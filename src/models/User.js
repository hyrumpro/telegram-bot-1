const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { type: Number, unique: true, required: true },
    username: { type: String, unique: true, sparse: true },
    points: { type: Number, default: 0 },
    currentTask: { type: String, default: null },
    walletAddress: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('User', userSchema);

