import Head from "next/head";
import ProductCard from "../components/ProductCard";

const products = [
  {
    name: "Credenza Antica",
    price: 1200,
    location: "Firenze",
    image: "https://via.placeholder.com/400x300?text=Credenza+Antica",
  },
  {
    name: "Specchio Barocco",
    price: 850,
    location: "Roma",
    image: "https://via.placeholder.com/400x300?text=Specchio+Barocco",
  },
  {
    name: "Lampadario in vetro di Murano",
    price: 2100,
    location: "Venezia",
    image: "https://via.placeholder.com/400x300?text=Lampadario+Murano",
  },
  {
    name: "Tavolino in noce",
    price: 450,
    location: "Torino",
    image: "https://via.placeholder.com/400x300?text=Tavolino+in+Noce",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Sasaan Piz – Marketplace per antiquari e collezionisti</title>
        <meta
          name="description"
          content="Sasaan Piz: compra e vendi oggetti d'antiquariato in tutta Italia."
        />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Sasaan Piz</h1>
            <p className="text-gray-600">
              Marketplace per antiquari e collezionisti
            </p>
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Cerca oggetto o città"
              className="border p-2 rounded w-full sm:w-64"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Cerca
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.name} product={p} />
          ))}
        </div>
      </div>
    </>
  );
}
