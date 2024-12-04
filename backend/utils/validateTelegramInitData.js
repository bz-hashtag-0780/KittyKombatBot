const { validate, isErrorOfType } = require('@telegram-apps/init-data-node');

function validateTelegramInitData(initData) {
	try {
		validate(initData, process.env.TELEGRAM_BOT_TOKEN);
		return true;
	} catch (error) {
		if (isErrorOfType(error, 'ERR_SIGN_INVALID')) {
			throw new Error('Invalid signature');
		}
		if (isErrorOfType(error, 'ERR_AUTH_DATE_INVALID')) {
			throw new Error('auth_date is missing or invalid');
		}
		if (isErrorOfType(error, 'ERR_EXPIRED')) {
			throw new Error('initData has expired');
		}
		throw new Error('Unknown validation error');
	}
}

module.exports = validateTelegramInitData;
