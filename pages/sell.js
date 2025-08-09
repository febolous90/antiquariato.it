import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Sell() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", price: "", city: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return <div className="p-6">Caricamento…</div>;
  if (!session) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Devi accedere</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => signIn()}>
          Vai al Login
        </button>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          price: Number(form.price),
          city: form.city,
          description: form.description || null,
        }),
      });
      if (!res.ok) throw new Error("Errore nel salvataggio");
      await res.json();
      router.push("/");
    } catch (err) {
      setError(err.message || "Errore");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pubblica un annuncio</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium">Titolo</label>
          <input className="border p-2 rounded w-full" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        </div>
        <div>
          <label className="block font-medium">Prezzo (€)</label>
          <input type="number" step="0.01" min="0" className="border p-2 rounded w-full" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
        </div>
        <div>
          <label className="block font-medium">Città</label>
          <input className="border p-2 rounded w-full" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} required />
        </div>
        <div>
          <label className="block font-medium">Descrizione (facoltativa)</label>
          <textarea className="border p-2 rounded w-full" rows={4} value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60">
          {loading ? "Salvo…" : "Pubblica"}
        </button>
      </form>
    </div>
  );
}
