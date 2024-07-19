const User = require('../models/User');
const Task = require('../models/Task');
const { addPoints } = require('../utils/pointsSystem');

const tasks = [
    { id: 1, type: 'twitter_follow', description: "Follow @Zoolandereth on Twitter", points: 5, link: "https://twitter.com/Zoolandereth" },
    { id: 2, type: 'telegram_join', description: "Join Telegram Group: t.me/examplegroup", points: 3, link: "https://t.me/examplegroup" },
    { id: 3, type: 'twitter_like_retweet', description: "Like & Retweet the pinned tweet", points: 4, link: "https://twitter.com/Zoolandereth/status/1234567890" }
];

const cooldowns = {};

async function handleTaskCompletion(userId, taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    if (task.type === 'twitter_like_retweet') {
        if (cooldowns[userId] && Date.now() - cooldowns[userId] < 5000) {
            return { success: false, message: "Please wait 5 seconds before confirming this task." };
        }
        cooldowns[userId] = Date.now();
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const points = await addPoints(userId, task.points);
    await Task.findOneAndUpdate(
        { userId, taskId },
        { completed: true },
        { upsert: true }
    );

    return { success: true, points, message: `Task completed! You earned ${task.points} points.` };
}

module.exports = async (bot, msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text.toLowerCase();

    if (text === '/tasks') {
        let taskList = "Available tasks:\n\n";
        tasks.forEach(task => {
            taskList += `${task.id}. ${task.description} (${task.points} points)\n${task.link}\n\n`;
        });
        taskList += "To complete a task, click the link and then send the task number (e.g., '1' for the first task).";
        await bot.sendMessage(chatId, taskList);
    }
    else if (/^[1-3]$/.test(text)) {
        const taskId = parseInt(text);
        const result = await handleTaskCompletion(userId, taskId);
        if (result) {
            await bot.sendMessage(chatId, result.message);
        } else {
            await bot.sendMessage(chatId, "Invalid task number. Use /tasks to see available tasks.");
        }
    }
    else if (text === '/points') {
        const user = await User.findOne({ telegramId: userId });
        await bot.sendMessage(chatId, `Your current points: ${user ? user.points : 0}`);
    }
    else {
        await bot.sendMessage(chatId, "I didn't understand that command. Use /tasks to see available tasks or /points to check your current points.");
    }
};
