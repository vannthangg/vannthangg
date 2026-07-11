const express = require('express');
const cors = require('cors');
const authController = require('./src/AuthController');
const GlobalErrorHandler = require('../shared/middlewares/GlobalErrorHandler');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.post('/login', authController.login.bind(authController));

// Error handling
app.use(GlobalErrorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});
