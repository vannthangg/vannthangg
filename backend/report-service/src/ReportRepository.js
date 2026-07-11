const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ReportRepository {
    async createRating(data) {
        return prisma.rating.create({ data });
    }

    async getRatings() {
        return prisma.rating.findMany();
    }

    async incrementDailyStat(date, revenue) {
        // Simple upsert logic
        let stat = await prisma.dailyStat.findUnique({ where: { date } });
        if (stat) {
            return prisma.dailyStat.update({
                where: { date },
                data: {
                    totalOrders: stat.totalOrders + 1,
                    totalRevenue: stat.totalRevenue + revenue
                }
            });
        } else {
            return prisma.dailyStat.create({
                data: {
                    date,
                    totalOrders: 1,
                    totalRevenue: revenue
                }
            });
        }
    }
}

module.exports = new ReportRepository();
