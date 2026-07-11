const express = require('express');
const cors = require('cors');
const tableController = require('./src/TableController');
const GlobalErrorHandler = require('../shared/middlewares/GlobalErrorHandler');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/', tableController.getAllTables.bind(tableController));
app.get('/:id', tableController.getTableById.bind(tableController));
app.post('/:id/call', tableController.callStaff.bind(tableController));

// Error handling
app.use(GlobalErrorHandler);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Table Service running on port ${PORT}`);
});
