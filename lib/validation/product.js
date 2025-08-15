// lib/validation/product.js
import { z } from 'zod';

// Trasforma prezzo in numero (accetta '1.234,56' o '1234.56')
export const parsePrice = (raw) => {
  if (typeof raw === 'number') return raw;
  if (typeof raw !== 'string') return NaN;
  const normalized = raw.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  return Number(normalized);
};

export const productCreateSchema = z.object({
  title: z.string().min(3, 'Titolo troppo corto').max(120, 'Titolo troppo lungo').trim(),
  city: z.string().min(2, 'Città non valida').max(80, 'Città troppo lunga').trim(),
  price: z.union([
    z.number().positive('Prezzo deve essere > 0').max(1_000_000),
    z.string().min(1).transform((v) => parsePrice(v)),
  ]).refine((n) => typeof n === 'number' && !Number.isNaN(n) && n > 0, 'Prezzo non valido'),
  description: z.string().max(1000, 'Descrizione troppo lunga').optional().or(z.literal('')),
});

// Serializza Date/Decimal per JSON
export const serializeProduct = (p) => ({
  ...p,
  createdAt: p.createdAt?.toISOString?.() ?? null,
  price: typeof p.price === 'object' ? p.price?.toString?.() : p.price,
});