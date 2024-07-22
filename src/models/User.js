const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { type: Number, unique: true, required: true },
    username: { type: String, unique: true, sparse: true },
    points: { type: Number, default: 0 },
    currentTask: { type: String, default: null },
    walletAddress: { type: String, default: null },
    completedTasks: {
        twitter: { type: Boolean, default: false },
        telegram: { type: Boolean, default: false },
        wallet: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('User', userSchema);

