const express = require('express');
const crypto = require('crypto');
const admin = require('../firebase/firebaseAdmin');
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

// New route to update user data with authentication check
router.post('/update-data', async (req, res) => {
	const { initData, newData } = req.body;

	// Verify the Telegram user with initData
	if (!verifyTelegramSignature(initData)) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	// Parse user ID from initData and ensure they can only modify their own data
	const data = Object.fromEntries(new URLSearchParams(initData));
	const uid = `telegram:${data.id}`;

	try {
		const userDoc = admin.firestore().collection('users').doc(uid);
		await userDoc.update(newData);
		res.json({ success: true, message: 'Data updated successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to update data' });
	}
});

module.exports = router;
