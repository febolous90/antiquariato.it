'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImageToCloudinary } from '@/lib/uploadImage';

export default function SellPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(''); // string per input number
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // validazione minima client-side
    if (!title.trim() || !city.trim() || !description.trim()) {
      alert('Compila tutti i campi obbligatori.');
      return;
    }
    const priceNumber = parseFloat(price);
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      alert('Inserisci un prezzo valido maggiore di 0.');
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl: string | null = null;

      if (file) {
        console.log('[sell] Upload FILE to Cloudinary…', { name: file.name, type: file.type, size: file.size });
        finalImageUrl = await uploadImageToCloudinary(file);
        console.log('[sell] Cloudinary secure_url:', finalImageUrl);
      } else if (imageUrlInput.trim() !== '') {
        // 🔁 coerente con il flusso: facciamo passare anche l'URL remoto da Cloudinary
        const remote = imageUrlInput.trim();
        console.log('[sell] Upload REMOTE URL to Cloudinary…', remote);
        finalImageUrl = await uploadImageToCloudinary(remote);
        console.log('[sell] Cloudinary secure_url (from URL):', finalImageUrl);
      } else {
        console.log('[sell] No image provided (imageUrl = null)');
      }

      const payload = {
        title: title.trim(),
        price: priceNumber,
        city: city.trim(),
        description: description.trim(),
        imageUrl: finalImageUrl ?? null,
      };
      console.log('[sell] POST /api/products payload:', payload);

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log('[sell] /api/products status:', res.status, res.statusText);
      console.log('[sell] /api/products body:', text);

      if (!res.ok) {
        // mostra anche il body per capire l’errore lato server (Zod/auth/etc.)
        throw new Error(`API error ${res.status}: ${text}`);
      }

      router.push('/');
    } catch (err: any) {
      console.error('[sell] submit error:', err);
      alert(`Errore durante il caricamento o il salvataggio:\n${err?.message || err}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
      <h1>Vendi un oggetto</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          required
          placeholder="Titolo"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          required
          type="number"
          step="0.01"
          placeholder="Prezzo (EUR)"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <input
          required
          placeholder="Città"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <textarea
          required
          placeholder="Descrizione"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <label>Carica immagine (file):
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <label>Oppure incolla URL immagine:
          <input
            type="url"
            placeholder="https://..."
            value={imageUrlInput}
            onChange={e => setImageUrlInput(e.target.value)}
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Salvataggio…' : 'Pubblica'}
        </button>
      </form>
    </main>
  );
}
