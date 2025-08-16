import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

const productSchema = z.object({
  title: z.string().min(1, 'Titolo obbligatorio'),
  description: z.string().min(1, 'Descrizione obbligatoria'),
  city: z.string().min(1, 'Città obbligatoria'),
  // Se nel tuo schema Prisma "price" è Decimal, teniamo number qui ma lo adattiamo sotto.
  price: z.number().positive('Prezzo deve essere > 0'),
  imageUrl: z.string().url().optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      const details = parsed.error.flatten();
      return NextResponse.json({ error: 'Dati non validi', details }, { status: 400 });
    }

    // Recupera l'ID utente SELLER
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    const { title, description, city, price, imageUrl } = parsed.data;

    // Se il campo "price" in Prisma è Decimal, usa Prisma.Decimal; altrimenti va bene number
    let priceValue: any = price;
    try {
      // Prova a creare col number direttamente
      const product = await prisma.product.create({
        data: {
          title,
          description,
          city,
          price: priceValue as any,
          imageUrl: imageUrl ?? null,
          sellerId: user.id,
        },
        select: { id: true },
      });
      return NextResponse.json({ id: product.id }, { status: 201 });
    } catch (e: any) {
      // Se è un problema di tipo per Decimal, riprova con Prisma.Decimal
      if (String(e?.message || '').toLowerCase().includes('decimal')) {
        const decimal = new (Prisma as any).Decimal ? new (Prisma as any).Decimal(price) : price;
        const product = await prisma.product.create({
          data: {
            title,
            description,
            city,
            price: decimal as any,
            imageUrl: imageUrl ?? null,
            sellerId: user.id,
          },
          select: { id: true },
        });
        return NextResponse.json({ id: product.id }, { status: 201 });
      }
      throw e; // rilancia: verrà gestito dal catch esterno
    }
  } catch (err: any) {
    console.error('POST /api/products error:', err);
    // Torna un dettaglio utile per capire subito
    return NextResponse.json(
      { error: 'Errore server', detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
