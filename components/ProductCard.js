export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition p-2 bg-white">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2 rounded" />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.location}</p>
      <p className="text-md font-bold mt-1">€{product.price}</p>
      <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Vedi</button>
    </div>
  );
}
