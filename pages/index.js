// pages/index.js
import ProductCard from '../components/ProductCard';
import prisma, { ensureDb } from '../lib/prisma';

// Formatter deterministico lato server (no sorprese ICU)
function formatEuro(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '—';
  const [intPartRaw, decRaw] = n.toFixed(2).split('.');
  const int = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // separatore migliaia con punto
  return `${int},${decRaw} €`;
}

// Helper retry per gestire cold start/pgBouncer
async function withRetry(fn, retries = 2, delay = 600) {
  try {
    return await fn();
  } catch (e) {
    if (retries <= 0) throw e;
    await new Promise((r) => setTimeout(r, delay));
    return withRetry(fn, retries - 1, delay);
  }
}

export default function Home({ products }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Sasaan Piz – Prodotti</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {(!products || products.length === 0) && (
        <p className="mt-10 text-sm text-gray-500">Nessun prodotto disponibile.</p>
      )}
    </main>
  );
}

export async function getServerSideProps() {
  // 1) Assicura la connessione (gestisce cold start)
  await ensureDb();

  // 2) Query con retry (gestisce risvegli lenti di Neon)
  const raw = await withRetry(() =>
    prisma.product.findMany({
      select: {
        id: true,
        title: true,
        city: true,
        price: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  );

  // 3) Serializza e prepara i dati per il client
  const products = raw.map((p) => {
    const priceNumber =
      typeof p.price === 'object' ? Number(p.price?.toString?.()) : Number(p.price);

    return {
      id: p.id,
      title: p.title ?? '',
      city: p.city ?? '',
      price: priceNumber, // mantieni numerico se ti serve altrove
      formattedPrice: formatEuro(priceNumber), // ← stringa pronta per il client
      createdAt: p.createdAt?.toISOString?.() ?? null,
    };
  });

  return { props: { products } };
}
