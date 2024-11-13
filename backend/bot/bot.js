const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(
		chatId,
		'Welcome to Kitty Kombat! Use /profile to view your stats.'
	);
});

module.exports = bot;
