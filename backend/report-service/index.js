const express = require('express');
const cors = require('cors');
const reportController = require('./src/ReportController');
const GlobalErrorHandler = require('../shared/middlewares/GlobalErrorHandler');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.post('/ratings', reportController.submitRating.bind(reportController));
app.get('/ratings', reportController.getRatings.bind(reportController));

// Error handling
app.use(GlobalErrorHandler);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Report Service running on port ${PORT}`);
});
