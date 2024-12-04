const jwt = require('jsonwebtoken');

function generateToken(payload) {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		throw new Error('Invalid or expired token');
	}
}

module.exports = { generateToken, verifyToken };
