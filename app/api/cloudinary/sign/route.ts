import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function handler() {
  const session = await getServerSession(authOptions);
  if (!session || (session as any).user?.role !== 'SELLER') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'antiquariato/products';

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({
    timestamp,
    signature,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}

export const GET = handler;   // permette test via browser
export const POST = handler;  // usato dal client
