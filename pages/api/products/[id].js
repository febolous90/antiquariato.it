import { PrismaClient } from "@prisma/client";

const prisma = globalThis._prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis._prisma = prisma;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const pid = parseInt(Array.isArray(id) ? id[0] : id, 10);
  if (Number.isNaN(pid)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: pid },
      include: { seller: { select: { id: true, email: true } } },
    });
    if (!product) return res.status(404).json({ error: "Not found" });
    return res.json(product);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
}
