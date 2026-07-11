const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserRepository {
    async findByUsername(username) {
        return prisma.user.findUnique({ where: { username } });
    }

    async findById(id) {
        return prisma.user.findUnique({ where: { id: Number(id) } });
    }
}

module.exports = new UserRepository();
