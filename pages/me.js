import { useSession, signOut } from "next-auth/react";

export default function Me() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p className="p-6">Caricamento…</p>;

  if (!session) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Area personale</h1>
        <p>Non sei loggato.</p>
        <a
          href="/api/auth/signin?callbackUrl=/me"
          className="inline-block rounded bg-black text-white px-4 py-2"
        >
          Accedi
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Ciao, {session.user?.email}</h1>
      <button
        onClick={() => signOut({ callbackUrl: "/me" })}
        className="rounded bg-gray-200 px-4 py-2"
      >
        Esci
      </button>
    </div>
  );
}
