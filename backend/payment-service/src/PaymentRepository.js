const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PaymentRepository {
    async createPaymentRequest(data) {
        return prisma.paymentRequest.create({ data });
    }

    async getPaymentRequestById(id) {
        return prisma.paymentRequest.findUnique({ where: { id: Number(id) } });
    }

    async updatePaymentStatus(id, status) {
        return prisma.paymentRequest.update({
            where: { id: Number(id) },
            data: { status }
        });
    }
}

module.exports = new PaymentRepository();
