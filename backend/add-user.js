const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function addUser() {
  try {
    // Xóa user cũ
    await prisma.user.deleteMany({});
    
    // Hash password
    const hashedPassword = await bcrypt.hash('123', 10);
    
    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: 'Admin',
        role: 'admin'
      }
    });
    
    console.log('✅ User tạo thành công:', user);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addUser();
