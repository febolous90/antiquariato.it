const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_EMAIL || "demo@antiquariato.it";
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error("Utente seed non trovato:", email);
    process.exit(1);
  }

  const product = await prisma.product.create({
    data: {
      title: "Orologio da taschino d’epoca",
      description: "Funzionante, fine ’800, cassa in argento.",
      price: 199.0,
      city: "Milano",
      sellerId: user.id,
    },
  });

  console.log("Creato prodotto:", { id: product.id, title: product.title, sellerId: product.sellerId });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
