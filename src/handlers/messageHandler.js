const User = require('../models/User');
const { verifyTwitterTask, verifyWalletAddress, verifyTelegramJoin } = require('../utils/taskHandler');

module.exports = async (bot, msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    const user = await User.findOne({ telegramId: userId });
    if (!user) {
        await bot.sendMessage(chatId, "Please start the bot with /start first.");
        return;
    }

    switch (user.currentTask) {
        case 'twitter':
            await verifyTwitterTask(bot, chatId, user, text);
            break;
        case 'wallet':
            await verifyWalletAddress(bot, chatId, user, text);
            break;
        case 'telegram_join':
            await verifyTelegramJoin(bot, query);
            break;
        default:
            await bot.sendMessage(chatId, "I didn't understand that. Please use the buttons to select a task, or use /start to see the main menu.");
    }
};
