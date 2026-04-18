const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
  const tables = await prisma.table.findMany({ orderBy: { id: 'asc' } });
  console.log('\n=== DATABASE TABLE IDs ===');
  tables.forEach((t, idx) => {
    console.log(`${idx + 1}. ID: ${t.id}, Name: ${t.name}`);
  });
  await prisma.$disconnect();
}

checkTables().catch(console.error);
