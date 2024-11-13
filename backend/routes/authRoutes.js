const express = require('express');
const crypto = require('crypto');
const admin = require('../firebase/firebaseAdmin');
const router = express.Router();

// Helper function to verify Telegram signature (same as before)
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

// Existing route to verify Telegram and get user data
router.post('/verify-telegram', async (req, res) => {
	const { initData } = req.body;

	if (!verifyTelegramSignature(initData)) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const data = Object.fromEntries(new URLSearchParams(initData));
	const uid = `telegram:${data.id}`;

	try {
		const userDoc = admin.firestore().collection('users').doc(uid);
		const doc = await userDoc.get();

		if (!doc.exists) {
			const initialData = {
				userId: uid,
				currency: 100,
				cats: [{ level: 1 }],
			};
			await userDoc.set(initialData);
			res.json({ authenticated: true, data: initialData });
		} else {
			res.json({ authenticated: true, data: doc.data() });
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to access game data' });
	}
});

// New route to update user data
router.post('/update-data', async (req, res) => {
	const { userId, newData } = req.body;

	try {
		const userDoc = admin.firestore().collection('users').doc(userId);
		await userDoc.update(newData);
		res.json({ success: true, message: 'Data updated successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to update data' });
	}
});

module.exports = router;
