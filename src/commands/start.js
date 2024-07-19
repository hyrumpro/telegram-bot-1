const User = require('../models/User');

module.exports = async (bot, msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOneAndUpdate(
        { telegramId: msg.from.id },
        { username: msg.from.username },
        { upsert: true, new: true }
    );

    const welcomeMessage = `Welcome to the Advanced Telegram Bot, ${msg.from.first_name}! 🎉\n\nYour current points: ${user.points}`;

    const menuMessage = `
Here are the available commands:

/start - Start the bot and see this menu
/help - Get detailed information about commands
/points - Check your current points
/task - Get a random task to earn points

Feel free to use these commands anytime!`;

    // Send welcome message
    await bot.sendMessage(chatId, welcomeMessage);

    // Send menu message
    await bot.sendMessage(chatId, menuMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
            keyboard: [
                ['/points', '/task'],
                ['/help']
            ],
            resize_keyboard: true
        }
    });
};
