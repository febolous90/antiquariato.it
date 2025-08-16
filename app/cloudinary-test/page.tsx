'use client';
import { useState } from 'react';

export default function CloudinaryTest() {
  const [out, setOut] = useState('—');

  async function testSign(method: 'GET'|'POST') {
    setOut(`Chiamo /api/cloudinary/sign con ${method}…`);
    try {
      const res = await fetch('/api/cloudinary/sign', { method });
      const txt = await res.text();
      setOut(`${res.status} ${res.statusText}\n${txt}`);
    } catch (e: any) {
      setOut(`Errore: ${e?.message || e}`);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Test firma Cloudinary</h1>
      <p>Devi essere loggato come SELLER.</p>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={() => testSign('GET')}>GET</button>
        <button onClick={() => testSign('POST')}>POST</button>
      </div>
      <pre style={{ marginTop:16, background:'#111', color:'#0f0', padding:12, whiteSpace:'pre-wrap' }}>{out}</pre>
    </main>
  );
}
