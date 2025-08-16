import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const prisma = new PrismaClient();

function formatEUR(v: number) {
  return v.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, city: true, price: true, imageUrl: true },
  });

  const FALLBACK = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

  return (
    <main style={{ margin: "0 auto", maxWidth: 1200, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Antiquariato.it</h1>
        <div style={{ color: "#6b7280", fontSize: 14 }}>Prodotti: {products.length}</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 14,
          alignItems: "start",
        }}
      >
        {products.map((p) => {
          const src = p.imageUrl ?? FALLBACK;
          return (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              style={{
                display: "block",
                borderRadius: 12,
                background: "#fff",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {/* immagine compatta */}
              <div
                style={{
                  width: "100%",
                  height: 160, // 👈 più piccola
                  background: "#f3f4f6",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={src}
                  alt={p.title}
                  width={600}
                  height={400}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  unoptimized
                />
              </div>

              <div style={{ padding: 10 }}>
                <h3
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: 16,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={p.title}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    color: "#6b7280",
                    fontSize: 13,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={p.city}
                >
                  {p.city}
                </p>
                <p style={{ margin: "8px 0 0 0", fontWeight: 700 }}>{formatEUR(p.price)}</p>
              </div>
            </Link>
          );
        })}

        {products.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280" }}>
            Nessun prodotto. Vai su <Link href="/sell" style={{ textDecoration: "underline" }}>Vendi</Link> per crearne uno.
          </div>
        )}
      </div>
    </main>
  );
}
