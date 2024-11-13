const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Replace this URL with the URL of your deployed Next.js app
const webAppUrl = 'https://kitty-kombat-bot.vercel.app/kitty';

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(
		chatId,
		'Welcome to Kitty Kombat! Click the button below to access the game:',
		{
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: 'Play Kitty Kombat',
							web_app: { url: webAppUrl },
						},
					],
				],
			},
		}
	);
});

module.exports = bot;
