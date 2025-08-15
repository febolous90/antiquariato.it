// pages/api/products/index.js
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { productCreateSchema, serializeProduct } from "../../../lib/validation/product";

function isSeller(session) {
  return session?.user?.role === "SELLER";
}

// Helper: piccolo retry per gestire eventuale cold start di Neon/pgBouncer
async function withRetry(fn, retries = 2, delay = 600) {
  try {
    return await fn();
  } catch (e) {
    if (retries <= 0) throw e;
    await new Promise((r) => setTimeout(r, delay));
    return withRetry(fn, retries - 1, delay);
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const items = await withRetry(() =>
        prisma.product.findMany({ orderBy: { createdAt: "desc" } })
      );
      return res.status(200).json(items.map(serializeProduct));
    } catch (err) {
      console.error("[GET /api/products] error:", err);
      return res.status(500).json({ error: "Errore interno" });
    }
  }

  if (req.method === "POST") {
    // 1) Autenticazione
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Non autenticato" });
    if (!isSeller(session)) return res.status(403).json({ error: "Solo SELLER possono creare prodotti" });

    // 2) Trova il seller in DB tramite email di sessione (per avere un id numerico valido)
    const sellerEmail = session.user?.email;
    const seller = sellerEmail
      ? await prisma.user.findUnique({ where: { email: sellerEmail } })
      : null;

    if (!seller) {
      return res.status(403).json({ error: "Seller non presente nel DB per questa sessione" });
    }

    // 3) Validazione input con Zod
    try {
      const parsed = productCreateSchema.parse(req.body);

      // Se salvi in centesimi: decommenta e usa price: priceCents
      // const priceCents = Math.round(parsed.price * 100);

      // 4) Creazione su DB con sellerId
      const created = await prisma.product.create({
        data: {
          title: parsed.title,
          city: parsed.city,
          price: parsed.price, // oppure: priceCents
          description: parsed.description || null,
          sellerId: seller.id,
        },
      });

      return res.status(201).json(serializeProduct(created));
    } catch (err) {
      if (err?.name === "ZodError") {
        return res.status(400).json({
          error: "ValidationError",
          issues: err.issues.map((i) => ({ path: i.path, message: i.message })),
        });
      }
      console.error("[POST /api/products] error:", err);
      return res.status(500).json({ error: "Errore interno" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Metodo non consentito" });
}
