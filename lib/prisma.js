// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function ensureDb() {
  // con SQLite è istantaneo, ma teniamo la firma compatibile
  await prisma.$connect();
}

export default prisma;
