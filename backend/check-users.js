const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany();
  console.log('\n=== USERS IN DATABASE ===');
  users.forEach((u) => {
    console.log(`ID: ${u.id}, Username: ${u.username}, Role: ${u.role}`);
  });
  await prisma.$disconnect();
}

checkUsers().catch(console.error);
