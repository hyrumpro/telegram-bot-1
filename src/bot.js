require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const commandHandler = require('./handlers/commandHandler');
const messageHandler = require('./handlers/messageHandler');
const { handleTaskSelection } = require('./utils/taskHandler');
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Handle commands
bot.onText(/^\//, (msg) => {
    commandHandler(bot, msg);
});

bot.on('message', (msg) => {
    if (!msg.text.startsWith('/')) {
        messageHandler(bot, msg);
    }
});

bot.on('callback_query', (query) => {
    handleTaskSelection(bot, query);
});

bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

console.log('Bot is running...');
