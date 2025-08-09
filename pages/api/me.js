import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = globalThis._prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis._prisma = prisma;

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const user = await prisma.user.findUnique({
    where: { id: parseInt(token.id, 10) },
    select: { id: true, email: true, role: true },
  });

  return res.status(200).json({ user });
}
