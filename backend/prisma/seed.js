const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu seed data...');

  // Xóa dữ liệu cũ nếu có
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.callRequest.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();

  // Tạo Bàn
  const tables = await Promise.all([
    prisma.table.create({ data: { name: 'Bàn 1', qrCode: '1' } }),
    prisma.table.create({ data: { name: 'Bàn 2', qrCode: '2' } }),
    prisma.table.create({ data: { name: 'Bàn VIP', qrCode: '3' } }),
  ]);
  console.log(`Đã tạo ${tables.length} bàn.`);

  // Tạo Danh mục
  const catKhaiVi = await prisma.category.create({ data: { name: 'Khai vị', sort: 1 } });
  const catMonChinh = await prisma.category.create({ data: { name: 'Món chính', sort: 2 } });
  const catNuocUong = await prisma.category.create({ data: { name: 'Nước uống', sort: 3 } });

  // Tạo Món ăn
  await prisma.menuItem.createMany({
    data: [
      { name: 'Khóai tây chiên', price: 35000, categoryId: catKhaiVi.id, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&q=80', description: 'Chiên giòn, béo ngậy' },
      { name: 'Nộm xoài tôm thịt', price: 65000, categoryId: catKhaiVi.id, image: 'https://images.unsplash.com/photo-1605926637512-c8b131444a4b?w=400&q=80', description: 'Chua ngọt đậm đà' },
      { name: 'Bò lúc lắc', price: 120000, categoryId: catMonChinh.id, image: 'https://images.unsplash.com/photo-1544025162-81111420d4d8?w=400&q=80', description: 'Ăn kèm khoai tây chiên' },
      { name: 'Gà nướng muối ớt', price: 180000, categoryId: catMonChinh.id, image: 'https://images.unsplash.com/photo-1598514981881-c7c427de2d10?w=400&q=80', description: 'Nửa con, kèm rau sống' },
      { name: 'Lẩu Thái hải sản', price: 250000, categoryId: catMonChinh.id, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80', description: 'Dành cho 2-3 người' },
      { name: 'Trà tắc', price: 20000, categoryId: catNuocUong.id, image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&q=80', description: 'Mát lạnh, giải nhiệt' },
      { name: 'Bia Heineken', price: 35000, categoryId: catNuocUong.id, image: 'https://images.unsplash.com/photo-1566838334469-80d46dd6c5fc?w=400&q=80', isAvailable: false },
    ]
  });

  console.log('Seed dữ liệu hoàn tất!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1); // eslint-disable-next-line no-undef
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
