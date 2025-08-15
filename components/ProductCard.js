// components/ProductCard.js
import Link from 'next/link';
import { useMemo } from 'react';

// Helper: "2 giorni fa"
function relativeFromNow(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  const m = 60 * 1000, h = 60 * m, day = 24 * h;
  let value, unit;
  if (abs < h) { value = Math.round(diff / m); unit = 'minute'; }
  else if (abs < day) { value = Math.round(diff / h); unit = 'hour'; }
  else { value = Math.round(diff / day); unit = 'day'; }
  return new Intl.RelativeTimeFormat('it', { numeric: 'auto' }).format(value, unit);
}

export default function ProductCard({ product }) {
  // atteso: { id, title, city, formattedPrice, createdAt, imageUrl? }
  const { id, title, city, formattedPrice, createdAt, imageUrl } = product || {};

  const displayTitle = title && title.trim() ? title : 'Senza titolo';
  const displayCity = city && city.trim() ? city : '—';

  const isNew = useMemo(() => {
    if (!createdAt) return false;
    const d = new Date(createdAt);
    return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000; // 7 giorni
  }, [createdAt]);

  return (
    <Link href={`/products/${id}`} aria-label={`Apri ${displayTitle}`} className="block group">
      <article className="h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all group-hover:shadow-md">
        {/* Media */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={displayTitle}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-xs text-gray-400">Nessuna immagine</div>
            </div>
          )}
          {isNew && (
            <span className="absolute left-2 top-2 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Nuovo
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
            {displayTitle}
          </h3>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">{displayCity}</p>
            {/* Usa solo la stringa server-side per evitare mismatch */}
            <p className="price text-sm font-semibold text-gray-900">{formattedPrice || '—'}</p>
          </div>

          {createdAt && (
            <p className="text-[11px] text-gray-400">
              Pubblicato {relativeFromNow(createdAt)}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
