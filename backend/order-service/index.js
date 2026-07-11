const express = require('express');
const cors = require('cors');
const orderController = require('./src/OrderController');
const GlobalErrorHandler = require('../shared/middlewares/GlobalErrorHandler');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.post('/', orderController.createOrder.bind(orderController));
app.get('/:id', orderController.getOrder.bind(orderController));
app.put('/:id/status', orderController.updateStatus.bind(orderController));

// Error handling
app.use(GlobalErrorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
