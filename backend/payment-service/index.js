const express = require('express');
const cors = require('cors');
const paymentController = require('./src/PaymentController');
const GlobalErrorHandler = require('../shared/middlewares/GlobalErrorHandler');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.post('/', paymentController.createPaymentRequest.bind(paymentController));
app.put('/:id/complete', paymentController.completePayment.bind(paymentController));

// Error handling
app.use(GlobalErrorHandler);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});
