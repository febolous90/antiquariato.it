type SignResponse = {
  timestamp: number;
  signature: string;
  folder: string;
  cloudName: string;
  apiKey: string;
};

/**
 * Carica un'immagine su Cloudinary usando firma server-side.
 * Accetta un File (upload locale) o string URL.
 * Ritorna la secure_url dell'immagine caricata.
 */
export async function uploadImageToCloudinary(input: File | string) {
  // 1. Otteniamo firma dal server
  const signRes = await fetch('/api/cloudinary/sign', { method: 'POST' });
  if (!signRes.ok) throw new Error('Impossibile ottenere firma Cloudinary');

  const { timestamp, signature, folder, cloudName, apiKey } =
    (await signRes.json()) as SignResponse;

  // 2. Prepariamo FormData per Cloudinary
  const fd = new FormData();
  fd.append('file', input); // può essere File o URL string
  fd.append('api_key', apiKey);
  fd.append('timestamp', String(timestamp));
  fd.append('signature', signature);
  fd.append('folder', folder);

  // 3. Upload verso Cloudinary
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const cloudRes = await fetch(uploadUrl, { method: 'POST', body: fd });

  if (!cloudRes.ok) {
    const errText = await cloudRes.text();
    console.error('Cloudinary error:', errText);
    throw new Error('Upload immagine fallito');
  }

  const json = await cloudRes.json();
  return json.secure_url as string;
}
