const admin = require('./firebaseAdmin');

async function verifyToken(req, res, next) {
	const token = req.headers.authorization?.split('Bearer ')[1];
	if (!token) {
		return res.status(401).send('Unauthorized: No token provided');
	}

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		req.playerId = decodedToken.uid;
		next(); // Proceed if the token is valid
	} catch (error) {
		res.status(401).send('Unauthorized: Invalid token');
	}
}

module.exports = verifyToken;
