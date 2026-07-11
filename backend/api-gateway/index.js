const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const AuthMiddleware = require('./AuthMiddleware');
const GlobalErrorHandler = require('../../shared/middlewares/GlobalErrorHandler');
require('dotenv').config();

const app = express();
app.use(cors());

// Define service URLs
const SERVICES = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    menu: process.env.MENU_SERVICE_URL || 'http://localhost:3002',
    order: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
    table: process.env.TABLE_SERVICE_URL || 'http://localhost:3004',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
    report: process.env.REPORT_SERVICE_URL || 'http://localhost:3006',
};

// Route: Auth (No authentication required)
app.use('/api/auth', createProxyMiddleware({ target: SERVICES.auth, changeOrigin: true }));

// Protected routes (Require Authentication)
// In a real system, some table or menu routes might be public for customers scanning QR codes.
// For this architecture, we apply middleware based on route prefixes.

// Table service proxy
app.use('/api/table', createProxyMiddleware({ target: SERVICES.table, changeOrigin: true }));

// Menu service proxy
app.use('/api/menu', createProxyMiddleware({ target: SERVICES.menu, changeOrigin: true }));

// Order service proxy
app.use('/api/order', createProxyMiddleware({ target: SERVICES.order, changeOrigin: true }));

// Payment service proxy
app.use('/api/payment', createProxyMiddleware({ target: SERVICES.payment, changeOrigin: true }));

// Report service proxy
app.use('/api/report', AuthMiddleware, createProxyMiddleware({ target: SERVICES.report, changeOrigin: true }));

app.use(GlobalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
