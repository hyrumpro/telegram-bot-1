const User = require('../models/User');
const { createWelcomeMessage } = require('../utils/messageTemplates');
const { handleTaskSelection } = require('../utils/taskHandler');

const commands = {};

function registerCommand(name, description, handler) {
    commands[name.toLowerCase()] = { description, handler };
}

registerCommand('start', 'Start the bot', async (bot, msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOneAndUpdate(
        { telegramId: msg.from.id },
        { username: msg.from.username },
        { upsert: true, new: true }
    );

    const welcomeMessage = createWelcomeMessage(user.username);
    await bot.sendMessage(chatId, welcomeMessage.text, welcomeMessage.options);
});


registerCommand('help', 'Show available commands', async (bot, msg) => {
    const chatId = msg.chat.id;
    let helpText = 'Available commands:\n\n';
    Object.keys(commands).forEach(cmd => {
        helpText += `/${cmd} - ${commands[cmd].description}\n`;
    });
    await bot.sendMessage(chatId, helpText);
});

registerCommand('points', 'Check your current points', async (bot, msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOne({ telegramId: msg.from.id });
    await bot.sendMessage(chatId, `Your current points: ${user ? user.points : 0}`);
});

/*
registerCommand('task', 'Get a random task', async (bot, msg) => {
    const chatId = msg.chat.id;
    const tasks = [
        'Follow @Zoolandereth on Twitter',
        'Join our Telegram group: t.me/examplegroup',
        'Like & Retweet our pinned tweet'
    ];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    await bot.sendMessage(chatId, `Here's your task: ${randomTask}`);
});
*/



// Main command handler function
async function commandHandler(bot, msg) {
    const text = msg.text.split(' ')[0].substring(1).toLowerCase();
    const args = msg.text.split(' ').slice(1);

    if (commands[text]) {
        try {
            await commands[text].handler(bot, msg, args);
        } catch (error) {
            console.error(`Error executing command ${text}:`, error);
            await bot.sendMessage(msg.chat.id, 'Sorry, there was an error processing your command.');
        }
    } else {
        await bot.sendMessage(msg.chat.id, 'Unknown command. Use /help to see available commands.');
    }
}

module.exports = commandHandler;

