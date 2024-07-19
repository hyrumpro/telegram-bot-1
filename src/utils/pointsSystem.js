const User = require('../models/User');

const addPoints = async (telegramId, points) => {
    const user = await User.findOneAndUpdate(
        { telegramId },
        { $inc: { points } },
        { new: true, upsert: true }
    );
    return user.points;
};

const getPoints = async (telegramId) => {
    const user = await User.findOne({ telegramId });
    return user ? user.points : 0;
};

module.exports = { addPoints, getPoints };