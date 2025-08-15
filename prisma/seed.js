// prisma/seed.js (CommonJS, compatibile SQLite, senza skipDuplicates)
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // 1) Crea/aggiorna utente demo SELLER con password hashata (demo1234)
  const passwordHash = await bcrypt.hash('demo1234', 10);

  // Se il tuo modello User NON ha 'role', rimuovi role: 'SELLER'
  const seller = await prisma.user.upsert({
    where: { email: 'demo@antiquariato.it' },
    update: {
      password: passwordHash,
      role: 'SELLER',
    },
    create: {
      email: 'demo@antiquariato.it',
      password: passwordHash, // il tuo schema richiede 'password'
      role: 'SELLER',
    },
  });

  // 2) Prodotti demo
  const products = [
    {
      title: "Orologio da taschino d’epoca",
      description: "Funzionante, fine ’800, cassa in argento.",
      price: 199,
      city: "Milano",
      sellerId: seller.id,
    },
    {
      title: "Vaso Liberty",
      description: "Ceramica primi '900, ottime condizioni",
      price: 2000,
      city: "Torino",
      sellerId: seller.id,
    },
    {
      title: "Consolle a muro",
      description: "Bellissima originale e certificata",
      price: 3499.98,
      city: "Vicenza",
      sellerId: seller.id,
    },
  ];

  // Crea uno per uno; se esiste già, ignora l’errore
  for (const data of products) {
    try {
      await prisma.product.create({ data });
    } catch (e) {
      // Se vuoi vedere l’errore, logga qui:
      // console.log('Ignoro errore create product:', e.message);
    }
  }

  console.log('✅ Seed completato');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
