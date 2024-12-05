const express = require('express');
const validateTelegramInitData = require('../utils/validateTelegramInitData');
const { generateToken } = require('../utils/jwt');
const { admin, db } = require('../firebase/firebaseAdmin');

const router = express.Router();

router.post('/', async (req, res) => {
	const { initData } = req.body;

	if (!initData) {
		return res.status(400).json({ error: 'initData is required' });
	}

	try {
		validateTelegramInitData(initData);

		const decodedInitData = decodeURIComponent(initData);
		const urlSearchParams = new URLSearchParams(decodedInitData);
		const params = Object.fromEntries(urlSearchParams.entries());

		const user = JSON.parse(params.user);
		const token = generateToken({ id: user.id, username: user.username });

		// Save user to Firestore
		const userDoc = db.collection('users').doc(user.id.toString());
		await userDoc.set(
			{
				username: user.username,
				firstName: user.first_name,
				lastName: user.last_name || '',
				authDate: new Date(parseInt(params.auth_date, 10) * 1000),
				lastLogin: admin.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		);

		res.json({ message: 'Authenticated', token });
	} catch (error) {
		console.error('Authentication error:', error.message);
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
