const { PrismaClient } = require('@prisma/client');

async function checkMenu() {
  const prisma = new PrismaClient();
  try {
    const items = await prisma.menuItem.findMany({ include: { category: true } });
    const categories = await prisma.category.findMany();
    const tables = await prisma.table.findMany();
    
    console.log('✅ Database Status:');
    console.log(`📌 Tables: ${tables.length} bàn`);
    console.log(`📂 Categories: ${categories.length} danh mục`);
    console.log(`🍽️ Menu Items: ${items.length} món`);
    
    if (items.length > 0) {
      console.log('\n📋 Menu Items:');
      items.forEach(item => {
        console.log(`  - ${item.name} (${item.category.name}): ${item.price}đ`);
      });
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkMenu();
