const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MenuRepository {
    async getAllCategories() {
        return prisma.category.findMany({
            include: { items: true },
            orderBy: { sort: 'asc' }
        });
    }

    async getMenuItem(id) {
        return prisma.menuItem.findUnique({ where: { id: Number(id) } });
    }

    async createCategory(data) {
        return prisma.category.create({ data });
    }

    async createMenuItem(data) {
        return prisma.menuItem.create({ data });
    }
}

module.exports = new MenuRepository();
