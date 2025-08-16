import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({
    loggedIn: !!session,
    email: session?.user?.email || null,
    role: (session as any)?.user?.role || null,
  });
}

