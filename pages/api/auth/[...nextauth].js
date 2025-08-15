// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
// import prisma from '../../../lib/prisma'; // Se vuoi abilitare login da DB in futuro

export const authOptions = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 }, // 7 giorni
  secret: process.env.NEXTAUTH_SECRET, // assicurati di averlo in .env
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        // --- DEMO SELLER ---
        if (email === 'demo@antiquariato.it' && password === 'demo1234') {
          return { id: 'demo-id', email, role: 'SELLER' };
        }

        // --- Esempio per attivare login da DB (commentato) ---
        // const user = await prisma.user.findUnique({ where: { email } });
        // if (!user) return null;
        // const ok = await verifyPassword(password, user.passwordHash); // implementa tu
        // if (!ok) return null;
        // return { id: user.id, email: user.email, role: user.role || 'BUYER' };

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.id;
        token.role = user.role ?? token.role ?? 'BUYER';
        token.email = user.email ?? token.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
export default NextAuth(authOptions);