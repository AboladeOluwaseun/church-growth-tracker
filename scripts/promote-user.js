const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promoteUser(email) {
  if (!email) {
    console.error('Please provide an email address.');
    process.exit(1);
  }

  try {
    console.log(`Searching for user with email: ${email}...`);
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log(`Success! User ${user.name} (${user.email}) has been promoted to ADMIN.`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.error('Error: User not found.');
    } else {
      console.error('Error promoting user:', error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
promoteUser(email);
