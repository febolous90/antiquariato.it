import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import NavAuth from "../components/NavAuth";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <NavAuth />
      <div className="max-w-4xl mx-auto p-4">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
