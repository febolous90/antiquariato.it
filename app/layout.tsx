import SiteHeader from '@/components/SiteHeader';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'Antiquariato.it',
  description: 'Annunci di antiquariato',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body style={{ background: '#f9fafb', color: '#111827', margin: 0 }}>
        <AuthProvider>
          <SiteHeader />
          <main style={{ maxWidth: 1200, margin: '0 auto', padding: '16px' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
