const paymentService = require('./PaymentService');

class PaymentController {
    async createPaymentRequest(req, res, next) {
        try {
            const { tableId, tableName, orderId, method, note } = req.body;
            const request = await paymentService.createPaymentRequest({
                tableId: parseInt(tableId),
                tableName,
                orderId: orderId ? parseInt(orderId) : null,
                method,
                note
            });
            res.status(201).json(request);
        } catch (error) {
            next(error);
        }
    }

    async completePayment(req, res, next) {
        try {
            const { id } = req.params;
            const payment = await paymentService.completePayment(id);
            res.json(payment);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PaymentController();
