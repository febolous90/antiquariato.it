'use client';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(6px)', background: 'rgba(255,255,255,0.9)',
      borderBottom: '1px solid #eee'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>Antiquariato.it</span>
        </Link>

        <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link
            href="/sell"
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              background: pathname === '/sell' ? '#111827' : '#f3f4f6',
              color: pathname === '/sell' ? '#fff' : '#111827',
              fontSize: 14, fontWeight: 600
            }}
          >
            Vendi
          </Link>

          {status === 'loading' ? (
            <span style={{ fontSize: 14, color: '#6b7280' }}>…</span>
          ) : session ? (
            <>
              <span style={{ fontSize: 14, color: '#374151' }}>{session.user?.email}</span>
              <button
                onClick={() => signOut()}
                style={{ padding: '8px 12px', borderRadius: 8, background: '#f3f4f6', border: 'none', cursor: 'pointer', fontSize: 14 }}
              >
                Esci
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              style={{ padding: '8px 12px', borderRadius: 8, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14 }}
            >
              Entra
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
