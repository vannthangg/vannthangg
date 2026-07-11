const paymentRepository = require('./PaymentRepository');
const EventBus = require('../../shared/events/EventBus');
const EventContracts = require('../../shared/events/EventContracts');

class PaymentService {
    constructor() {
        this.initEventListeners();
    }

    async initEventListeners() {
        // Example: Subscribe to OrderCreatedEvent if needed (e.g. to pre-create payment intents)
        EventBus.subscribe(EventContracts.OrderCreatedEvent, (order) => {
            console.log(`[PaymentService] Received OrderCreatedEvent for order ${order.id}`);
        });
    }

    async createPaymentRequest(data) {
        return paymentRepository.createPaymentRequest(data);
    }

    async completePayment(id) {
        const payment = await paymentRepository.updatePaymentStatus(id, 'completed');
        // Publish event to let OrderService or ReportService know
        EventBus.publish(EventContracts.PaymentCompletedEvent, payment);
        return payment;
    }
}

module.exports = new PaymentService();
