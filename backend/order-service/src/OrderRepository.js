const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderRepository {
    async createOrder(data) {
        return prisma.order.create({
            data,
            include: { items: true }
        });
    }

    async getOrderById(id) {
        return prisma.order.findUnique({
            where: { id: Number(id) },
            include: { items: true }
        });
    }

    async updateOrderStatus(id, status) {
        return prisma.order.update({
            where: { id: Number(id) },
            data: { status }
        });
    }
}

module.exports = new OrderRepository();
