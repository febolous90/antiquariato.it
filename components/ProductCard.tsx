import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: {
    id: number;
    title: string;
    city: string;
    price: number;
    imageUrl?: string | null;
  };
  formatPrice?: (v: number) => string; // se già la usi ovunque
};

export default function ProductCard({ product, formatPrice }: ProductCardProps) {
  const priceText = formatPrice ? formatPrice(product.price) : product.price.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
  const src = product.imageUrl ?? "https://via.placeholder.com/600x400?text=Antiquariato";

  return (
    <Link href={`/products/${product.id}`} className="block rounded-lg shadow hover:shadow-md overflow-hidden">
      <div className="relative w-full aspect-[3/2] bg-gray-100">
        {/* next/image richiede domini abilitati in next.config.js (già aggiunto) */}
        <Image
          src={src}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
          // opzionale: priority solo per le prime card
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-1">{product.city}</p>
        <p className="mt-1 font-semibold">{priceText}</p>
      </div>
    </Link>
  );
}
