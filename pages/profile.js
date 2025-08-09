import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Profile() {
  const { data: session, status } = useSession();
  const [me, setMe] = useState(null);

  useEffect(() => {
    // prova a caricare i dati dal nostro endpoint
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user || null))
      .catch(() => setMe(null));
  }, []);

  if (status === "loading") {
    return <div className="p-6">Caricamento…</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Profilo</h1>
        <p className="mb-4">Non sei autenticato.</p>
        <button
          onClick={() => signIn()}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Vai al login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Profilo</h1>

      <div className="rounded border p-4">
        <p className="mb-1"><b>Email (sessione):</b> {session.user?.email}</p>
        <p className="mb-1"><b>Ruolo (sessione):</b> {session.user?.role}</p>
      </div>

      <div className="rounded border p-4">
        <p className="mb-1"><b>Dati dal DB (/api/me):</b></p>
        {me ? (
          <ul className="list-disc ml-5">
            <li>ID: {me.id}</li>
            <li>Email: {me.email}</li>
            <li>Ruolo: {me.role}</li>
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Nessun dato caricato.</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => signOut()}
          className="bg-gray-800 text-white rounded px-4 py-2"
        >
          Esci
        </button>
        <a
          href="/"
          className="rounded border px-4 py-2"
        >
          Home
        </a>
      </div>
    </div>
  );
}
