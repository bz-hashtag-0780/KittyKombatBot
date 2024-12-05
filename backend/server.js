const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
require('dotenv').config();
const bot = require('./bot/bot');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3001',
		methods: ['POST', 'GET'],
	})
);
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
