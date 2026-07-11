const orderRepository = require('./OrderRepository');
const EventBus = require('../../shared/events/EventBus');
const EventContracts = require('../../shared/events/EventContracts');

class OrderService {
    async createOrder(data) {
        const order = await orderRepository.createOrder(data);
        // Publish event to EventBus (RabbitMQ)
        EventBus.publish(EventContracts.OrderCreatedEvent, order);
        return order;
    }

    async getOrderById(id) {
        return orderRepository.getOrderById(id);
    }

    async updateOrderStatus(id, status) {
        const order = await orderRepository.updateOrderStatus(id, status);
        if (status === 'cancelled') {
            EventBus.publish(EventContracts.OrderCancelledEvent, order);
        }
        return order;
    }
}

module.exports = new OrderService();
