// pages/products/[id].js
import Link from "next/link";
import prisma from "../../lib/prisma";

// Helper: data relativa (es. "2 giorni fa")
function relativeFromNow(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  const minute = 60 * 1000, hour = 60 * minute, day = 24 * hour;

  let value, unit;
  if (abs < hour) { value = Math.round(diff / minute); unit = "minute"; }
  else if (abs < day) { value = Math.round(diff / hour); unit = "hour"; }
  else { value = Math.round(diff / day); unit = "day"; }

  return new Intl.RelativeTimeFormat("it", { numeric: "auto" }).format(value, unit);
}

export default function ProductPage({ product }) {
  if (!product) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p>Prodotto non trovato.</p>
        <Link href="/" className="text-blue-600 underline">Torna alla home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-blue-600 underline">&larr; Torna alla home</Link>

      <h1 className="mt-4 text-3xl font-bold">{product.title}</h1>

      <p className="mt-1 text-gray-600">
        Città: <b>{product.city}</b>
        {product.seller?.email ? <> &nbsp;•&nbsp; Venditore: <b>{product.seller.email}</b></> : null}
      </p>

      <p className="mt-4 text-2xl">{product.formattedPrice}</p>

      {product.description && (
        <p className="mt-4 whitespace-pre-line">{product.description}</p>
      )}

      <p className="mt-6 text-xs text-gray-500">
        Inserito {relativeFromNow(product.createdAt)} (il {product.formattedDate})
      </p>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const id = Number(params?.id);
  if (!id || Number.isNaN(id)) return { notFound: true };

  const raw = await prisma.product.findUnique({
    where: { id },
    include: { seller: { select: { id: true, email: true } } },
  });

  if (!raw) return { notFound: true };

  // Serializza e formatta in modo robusto
  const createdAtISO = raw.createdAt?.toISOString?.() ?? null;
  const createdAt = raw.createdAt;
  const formattedDate = createdAt
    ? `${String(createdAt.getDate()).padStart(2, "0")}/${String(createdAt.getMonth() + 1).padStart(2, "0")}/${createdAt.getFullYear()}`
    : "";

  const priceNumber = typeof raw.price === "object" ? Number(raw.price?.toString?.()) : Number(raw.price);

  const product = {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    price: priceNumber,
    formattedPrice: new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(priceNumber),
    city: raw.city,
    seller: raw.seller || null,
    createdAt: createdAtISO,
    updatedAt: raw.updatedAt?.toISOString?.() ?? null,
    formattedDate,
  };

  return { props: { product } };
}
