const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Đang xóa Bàn VIP...');

  try {
    const table = await prisma.table.findFirst({
      where: { name: 'Bàn VIP' }
    });

    if (table) {
      // Trước khi xóa bàn, có thể cần xử lý các đơn hàng hoặc yêu cầu liên quan nếu database có ràng buộc
      // Ở đây ta xóa trực tiếp nếu schema cho phép hoặc cascading được set up
      await prisma.table.delete({
        where: { id: table.id }
      });
      console.log('✓ Đã xóa Bàn VIP thành công.');
    } else {
      console.log('! Không tìm thấy Bàn VIP trong hệ thống.');
    }
  } catch (error) {
    console.error('Lỗi khi xóa bàn:', error);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
