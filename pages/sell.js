// pages/sell.js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productCreateSchema } from "../lib/validation/product";
import { useState } from "react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

export default function SellPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productCreateSchema),
    defaultValues: { title: "", city: "", price: "", description: "" },
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) throw new Error("Devi accedere per vendere.");
        if (res.status === 403) throw new Error("Solo SELLER possono creare prodotti.");
        if (res.status === 400 && data?.issues) {
          throw new Error(data.issues.map((i) => i.message).join(" • "));
        }
        throw new Error(data?.error || "Errore imprevisto");
      }

      const created = await res.json();
      router.push(`/products/${created.id}`);
    } catch (e) {
      setServerError(e.message);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Metti in vendita</h1>

      {serverError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Titolo</label>
          <input
            {...register("title")}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
            placeholder="Cassettiera in noce, fine '800"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Città</label>
          <input
            {...register("city")}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
            placeholder="Milano"
          />
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Prezzo</label>
          <input
            {...register("price")}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
            placeholder="1.200,00"
            inputMode="decimal"
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Descrizione (opz.)</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
            placeholder="Dettagli, condizioni, misure…"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? "Salvataggio…" : "Pubblica"}
        </button>
      </form>
    </main>
  );
}

// Blocca l'accesso a non loggati e non-SELLER (SSR)
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/auth/signin", permanent: false } };
  }
  if (session.user?.role !== "SELLER") {
    return { notFound: true }; // 404 per chi non è SELLER
  }
  return { props: {} };
}
