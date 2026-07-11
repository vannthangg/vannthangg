const express = require('express');
const cors = require('cors');
const menuController = require('./src/MenuController');
const GlobalErrorHandler = require('../shared/middlewares/GlobalErrorHandler');
require('dotenv').config();
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Routes
app.get('/categories', menuController.getAllCategories.bind(menuController));
app.get('/items/:id', menuController.getMenuItem.bind(menuController));
app.post('/categories', menuController.addCategory.bind(menuController));
app.post('/items', upload.single('image'), menuController.addMenuItem.bind(menuController));

// Error handling
app.use(GlobalErrorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Menu Service running on port ${PORT}`);
});
