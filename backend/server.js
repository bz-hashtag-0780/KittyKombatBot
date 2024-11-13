const express = require('express');
const dotenv = require('dotenv');
const authRouter = require('./routes/authRoutes');
const bot = require('./bot/bot');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
