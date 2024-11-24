const crypto = require('crypto');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const verifyTelegramInitData = (initData) => {
	const secretKey = crypto
		.createHash('sha256')
		.update(TELEGRAM_BOT_TOKEN)
		.digest();
	const parsedData = new URLSearchParams(initData);
	const hash = parsedData.get('hash');
	parsedData.delete('hash');

	const dataCheckString = Array.from(parsedData.entries())
		.map(([key, value]) => `${key}=${value}`)
		.sort()
		.join('\n');

	const hmac = crypto
		.createHmac('sha256', secretKey)
		.update(dataCheckString)
		.digest('hex');

	return hmac === hash;
};

module.exports = verifyTelegramInitData;
