const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const timer = setTimeout(() => {
  console.log('DB TIMEOUT after 8 seconds');
  process.exit(1);
}, 8000);

prisma.$connect()
  .then(() => {
    clearTimeout(timer);
    console.log('DB connected OK');
    return prisma.$disconnect();
  })
  .then(() => process.exit(0))
  .catch((e) => {
    clearTimeout(timer);
    console.log('DB error:', e.message);
    process.exit(1);
  });
