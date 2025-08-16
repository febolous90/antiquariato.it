import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

function formatEUR(v: number) {
  return v.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, title: true, description: true, price: true, city: true, imageUrl: true, createdAt: true },
  });

  if (!product) return notFound();

  const src = product.imageUrl ?? "https://res.cloudinary.com/demo/image/upload/sample.jpg";

  return (
    <main style={{ margin: "0 auto", maxWidth: 1000, padding: 16 }}>
      <Link href="/" style={{ textDecoration: "none", color: "#2563eb" }}>← Torna alla home</Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginTop: 12 }}>
        <div style={{ width: "100%", height: 420, background: "#f3f4f6", overflow: "hidden", borderRadius: 12 }}>
          <Image
            src={src}
            alt={product.title}
            width={1200}
            height={800}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            unoptimized
          />
        </div>

        <section style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", padding: 16 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{product.title}</h1>
          <div style={{ marginTop: 6, color: "#6b7280" }}>{product.city}</div>
          <div style={{ marginTop: 12, fontSize: 22, fontWeight: 700 }}>{formatEUR(product.price)}</div>
          <p style={{ marginTop: 16, lineHeight: 1.6 }}>{product.description}</p>
        </section>
      </div>
    </main>
  );
}
