const express = require('express');
const { db } = require('../firebase/firebaseAdmin');
const { verifyToken } = require('../utils/jwt');

const router = express.Router();

router.post('/start', async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		const user = verifyToken(token);

		const gameSession = {
			userId: user.id,
			startTime: admin.firestore.FieldValue.serverTimestamp(),
			status: 'active',
		};

		const gameDoc = await db.collection('games').add(gameSession);

		res.json({ message: 'Game started', gameId: gameDoc.id });
	} catch (error) {
		console.error('Game start error:', error.message);
		res.status(400).json({ error: error.message });
	}
});

router.post('/end', async (req, res) => {
	const { gameId } = req.body;
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		const user = verifyToken(token);

		const gameDoc = db.collection('games').doc(gameId);
		await gameDoc.update({
			status: 'completed',
			endTime: admin.firestore.FieldValue.serverTimestamp(),
		});

		res.json({ message: 'Game ended', gameId });
	} catch (error) {
		console.error('Game end error:', error.message);
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
