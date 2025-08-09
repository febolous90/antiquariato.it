import { PrismaClient } from "@prisma/client";

const prisma = globalThis._prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis._prisma = prisma;

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { seller: { select: { id: true, email: true } } },
      });
      res.status(200).json(products);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to load products" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
