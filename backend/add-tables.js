const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Đang kiểm tra và thêm bàn...');

  const existingTables = await prisma.table.findMany();
  const existingNames = existingTables.map(t => t.name);

  const tablesToAdd = [
    { name: 'Bàn 7', qrCode: '7' },
    { name: 'Bàn 8', qrCode: '8' }
  ];

  for (const table of tablesToAdd) {
    if (!existingNames.includes(table.name)) {
        await prisma.table.create({ data: table });
        console.log(`✓ Đã thêm ${table.name}`);
    } else {
        console.log(`! ${table.name} đã tồn tại.`);
    }
  }

  console.log('Hoàn tất!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
