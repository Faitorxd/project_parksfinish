import React, { useRef, useState } from 'react';

export default function ImageUploader({ label, hint, currentUrl, onFile, aspect = '16/9' }) {
  const [preview, setPreview] = useState(currentUrl || null);
  const [drag,    setDrag]    = useState(false);
  const inputRef = useRef();

  const pick = file => {
    if (!file || !file.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(file));
    onFile(file);
  };

  const clear = e => { e.stopPropagation(); setPreview(null); onFile(null); };

  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700,
          color: '#64748B', marginBottom: 6, letterSpacing: '.6px', textTransform: 'uppercase' }}>
          {label}
        </label>
      )}
      {hint && <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>{hint}</p>}

      {preview ? (
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: aspect }}>
          <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => inputRef.current.click()} style={{
              background: 'rgba(0,0,0,.6)', color: 'white', border: 'none', borderRadius: 8,
              padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(4px)',
            }}>🔄 Cambiar</button>
            <button type="button" onClick={clear} style={{
              background: 'rgba(220,38,38,.8)', color: 'white', border: 'none',
              borderRadius: 8, padding: '5px 8px', fontSize: 12, cursor: 'pointer',
            }}>🗑️</button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
          style={{
            border: `2px dashed ${drag ? '#0284C7' : '#CBD5E1'}`,
            borderRadius: 12, aspectRatio: aspect,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, cursor: 'pointer',
            background: drag ? '#EFF6FF' : '#F8FAFC', transition: 'all .2s',
          }}>
          <div style={{ fontSize: 32 }}>📸</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#64748B' }}>Clic o arrastra una imagen</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>JPG · PNG · WebP · máx 5 MB</div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => pick(e.target.files[0])} />
    </div>
  );
}
