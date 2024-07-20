function createWelcomeMessage(username) {
    return {
        text: `Hello ${username},

I am your friendly Task Airdrop bot.

Get free $PRO Tokens for a few simple tasks via our Airdrop program.
1 $PRO = $0.1

💰 Complete mandatory tasks to earn 50 $PRO ($5) and unlock bonus tasks!

Click on the buttons below to complete each task:`,
        options: {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Twitter Task", callback_data: "twitter_task" }],
                    [{ text: "Telegram Task", callback_data: "telegram_task" }],
                    [{ text: "Wallet Task", callback_data: "wallet_task" }]
                ]
            }
        }
    };
}

module.exports = { createWelcomeMessage };
