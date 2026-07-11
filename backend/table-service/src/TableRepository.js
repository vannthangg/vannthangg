const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TableRepository {
    async getAllTables() {
        return prisma.table.findMany();
    }

    async getTableById(id) {
        return prisma.table.findUnique({ where: { id: Number(id) } });
    }

    async createCallRequest(data) {
        return prisma.callRequest.create({ data });
    }
}

module.exports = new TableRepository();
