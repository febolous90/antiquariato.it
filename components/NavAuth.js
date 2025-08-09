import { useSession, signIn, signOut } from "next-auth/react";

export default function NavAuth() {
  const { data: session, status } = useSession();

  return (
    <div className="w-full bg-gray-100 border-b">
      <div className="max-w-4xl mx-auto flex items-center justify-between p-3 text-sm">
        <a href="/" className="font-semibold">Antiquariato.it</a>

        {status === "loading" ? (
          <span>...</span>
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            <span>Ciao, {session.user.email}</span>
            <button
              onClick={() => signOut()}
              className="px-3 py-1 rounded bg-gray-800 text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn(undefined, { callbackUrl: "/" })}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            Accedi
          </button>
        )}
      </div>
    </div>
  );
}
