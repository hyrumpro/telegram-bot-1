// utils/taskHandler.js
const User = require('../models/User');

const TELEGRAM_GROUP_LINK = 'https://t.me/+uLgfILtx8jQ4Mjkx';
const TWITTER_TWEET_LINK = 'https://twitter.com/AGOToken/status/1234567890';
const TELEGRAM_GROUP_ID = '-1002233280256';

async function handleTaskSelection(bot, query) {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const taskType = query.data;

    const user = await User.findOne({ telegramId: userId });
    if (!user) {
        await bot.answerCallbackQuery(query.id, { text: "Please start the bot with /start first." });
        return;
    }

    switch (taskType) {
        case 'twitter_task':
            await handleTwitterTask(bot, chatId, user);
            break;
        case 'telegram_task':
            await handleTelegramTask(bot, chatId, user);
            break;
        case 'wallet_task':
            await handleWalletTask(bot, chatId, user);
            break;
        case 'telegram_join':
            await verifyTelegramJoin(bot, query);
            break;
    }

    await bot.answerCallbackQuery(query.id);
}

async function handleTwitterTask(bot, chatId, user) {
    await bot.sendMessage(chatId, `Please like and retweet this tweet:\n${TWITTER_TWEET_LINK}\n\nAfter you've done that, send me the link to your Twitter profile.`);
    user.currentTask = 'twitter';
    await user.save();
}


async function handleWalletTask(bot, chatId, user) {
    if (user.completedTasks && user.completedTasks.telegram) {
        await bot.sendMessage(chatId, "You've already completed the Wallet task.");
        return;
    }
    await bot.sendMessage(chatId, "Please send your ERC-20 wallet address to receive your $AGO tokens.");
    user.currentTask = 'wallet';
    user.completedTasks.wallet = true;
    await user.save();
}

async function verifyTwitterTask(bot, chatId, user, twitterLink) {
    // Here you would typically verify the Twitter action
    // For this example, we'll assume it's valid if it's a Twitter profile link
    if (twitterLink.includes('twitter.com/')) {
        user.points += 20;
        user.currentTask = null;
        await user.save();
        await bot.sendMessage(chatId, "Great job! You've earned 20 $AGO tokens for completing the Twitter task.");
    } else {
        await bot.sendMessage(chatId, "That doesn't look like a valid Twitter profile link. Please try again.");
    }
}

async function handleTelegramTask(bot, chatId, user) {
    if (user.completedTasks && user.completedTasks.telegram) {
        await bot.sendMessage(chatId, "You've already completed the Telegram task.");
        return;
    }

    const message = `Please join our Telegram group:\n${TELEGRAM_GROUP_LINK}\n\nClick the button below once you've joined.`;
    const options = {
        reply_markup: {
            inline_keyboard: [[{ text: "I've joined", callback_data: "telegram_join" }]]
        }
    };
    await bot.sendMessage(chatId, message, options);
}

async function verifyTelegramJoin(bot, query) {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const user = await User.findOne({ telegramId: userId });

    if (user.completedTasks && user.completedTasks.telegram) {
        await bot.answerCallbackQuery(query.id, { text: "You've already completed the Telegram task." });
        return;
    }

    try {
        // First, try to get chat info
        const chatInfo = await bot.getChat(TELEGRAM_GROUP_ID);
        console.log('Successfully accessed group:', chatInfo.title);

        // If successful, proceed to check member status
        const chatMember = await bot.getChatMember(TELEGRAM_GROUP_ID, userId);

        if (['member', 'administrator', 'creator'].includes(chatMember.status)) {
            user.points += 15;
            if (!user.completedTasks) user.completedTasks = {};
            user.completedTasks.telegram = true;
            await user.save();
            await bot.sendMessage(chatId, "Thanks for joining! You've earned 15 $PRO tokens.");
        } else {
            await bot.sendMessage(chatId, "It seems you haven't joined the group yet. Please join and try again.");
        }
    } catch (error) {
        console.error('Error accessing group or verifying membership:', error);
        await bot.sendMessage(chatId, "There was an error verifying your membership. Please ensure the bot is an admin and try again later.");
    }

    await bot.answerCallbackQuery(query.id);
}


async function verifyWalletAddress(bot, chatId, user, address) {
    if (address.startsWith('0x') && address.length === 42) {
        user.walletAddress = address;
        user.points += 15;
        user.currentTask = null;
        await user.save();
        await bot.sendMessage(chatId, "Wallet address recorded! You've earned 15 $PROtokens.");
    } else {
        await bot.sendMessage(chatId, "That doesn't look like a valid ERC-20 wallet address. Please try again.");
    }
}

module.exports = { handleTaskSelection, verifyTwitterTask, verifyTelegramJoin, verifyWalletAddress };
