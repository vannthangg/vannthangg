const orderService = require('./OrderService');

class OrderController {
    async createOrder(req, res, next) {
        try {
            const { tableId, items, orderType, tableName, createdBy } = req.body;
            
            if (!items || items.length === 0) {
                return res.status(400).json({ error: 'Giỏ hàng không được trống' });
            }

            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const orderData = {
                tableId: parseInt(tableId),
                tableName,
                orderType,
                createdBy,
                total,
                items: {
                    create: items.map(item => ({
                        menuItemId: item.id,
                        quantity: item.quantity,
                        note: item.note || '',
                        addedBy: createdBy
                    }))
                }
            };

            const order = await orderService.createOrder(orderData);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }

    async getOrder(req, res, next) {
        try {
            const { id } = req.params;
            const order = await orderService.getOrderById(id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await orderService.updateOrderStatus(id, status);
            res.json(order);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OrderController();
