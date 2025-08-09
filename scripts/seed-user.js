const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_EMAIL || "demo@antiquariato.it";
  const plain = process.env.SEED_PASSWORD || "demo1234";
  const role = "SELLER";

  const password = await bcrypt.hash(plain, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password, role },
  });

  console.log("Utente pronto:", { email, role });
  console.log("Password in chiaro per login di test:", plain);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
