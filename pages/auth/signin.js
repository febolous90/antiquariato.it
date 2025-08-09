import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white shadow rounded p-6 space-y-4">
          <h1 className="text-xl font-semibold">Sei già autenticato</h1>
          <p className="text-sm text-gray-600">{session.user?.email}</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Vai alla Home
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 border rounded"
            >
              Esci
            </button>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/");
    } else {
      setErr("Credenziali non valide");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white shadow rounded p-6 space-y-4"
      >
        <h1 className="text-2xl font-semibold">Accedi</h1>
        {err ? <p className="text-red-600 text-sm">{err}</p> : null}
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="mt-1 w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@antiquariato.it"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input
            type="password"
            className="mt-1 w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded px-4 py-2"
        >
          Entra
        </button>
        <p className="text-xs text-gray-500">
          Usa: <b>demo@antiquariato.it</b> / <b>demo1234</b>
        </p>
      </form>
    </div>
  );
}
