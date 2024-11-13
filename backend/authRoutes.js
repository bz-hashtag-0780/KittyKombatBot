const express = require('express');
const crypto = require('crypto');
const admin = require('./firebaseAdmin');
const router = express.Router();

// Helper function to verify Telegram signature
function verifyTelegramSignature(initData) {
	const secretKey = crypto
		.createHash('sha256')
		.update(process.env.TELEGRAM_BOT_TOKEN)
		.digest();

	const data = Object.fromEntries(new URLSearchParams(initData));
	const hash = data.hash;
	delete data.hash;

	const dataString = Object.keys(data)
		.sort()
		.map((key) => `${key}=${data[key]}`)
		.join('\n');

	const hmac = crypto
		.createHmac('sha256', secretKey)
		.update(dataString)
		.digest('hex');
	return hmac === hash;
}

router.post('/verify-telegram', async (req, res) => {
	const { initData } = req.body;

	if (!verifyTelegramSignature(initData)) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const data = Object.fromEntries(new URLSearchParams(initData));
	const uid = `telegram:${data.id}`;

	try {
		const customToken = await admin.auth().createCustomToken(uid);
		res.json({ customToken });
	} catch (error) {
		res.status(500).json({ error: 'Failed to generate token' });
	}
});

module.exports = router;
