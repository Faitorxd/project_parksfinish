import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { addReview } from '../lib/supabase';
import useInView from '../hooks/useInView';

function StarRating({ value, onChange, size = 24 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(v => (
        <button key={v}
          onClick={() => onChange && onChange(v)}
          onMouseEnter={() => onChange && setHover(v)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{
            background: 'none', border: 'none',
            cursor: onChange ? 'pointer' : 'default',
            padding: 0, lineHeight: 1, transition: 'transform .15s',
            transform: (onChange && (hover || value) >= v) ? 'scale(1.2)' : 'scale(1)',
          }}>
          <Star size={size}
            fill={(hover || value) >= v ? '#F59E0B' : 'none'}
            color={(hover || value) >= v ? '#F59E0B' : '#D1D5DB'}
            strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

export default function Reviews({ park, onReviewAdded }) {
  const [stars,  setStars]  = useState(0);
  const [text,   setText]   = useState('');
  const [name,   setName]   = useState('');
  const [toast,  setToast]  = useState('');
  const [busy,   setBusy]   = useState(false);
  const [hRef, hVis] = useInView();

  const notify = msg => { setToast(msg); setTimeout(() => setToast(''), 3200); };

  const submit = async () => {
    if (!stars)       { notify('⭐ Elige una puntuación'); return; }
    if (!text.trim()) { notify('✏️ Escribe un comentario'); return; }
    setBusy(true);
    try {
      await addReview(park.id, {
        name: name.trim() || 'Visitante',
        avatar: '👤',
        stars,
        text: text.trim(),
      });
      setStars(0); setText(''); setName('');
      notify('✅ ¡Reseña publicada! Gracias.');
      onReviewAdded?.();
    } catch {
      notify('❌ Error al publicar. Inténtalo de nuevo.');
    }
    setBusy(false);
  };

  return (
    <section id="resenas" style={{ padding: '100px 48px', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div ref={hRef} style={{
          textAlign: 'center', marginBottom: 56,
          opacity: hVis ? 1 : 0, transform: hVis ? 'none' : 'translateY(24px)', transition: 'all .6s',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.25)',
            color: '#B45309', padding: '5px 14px', borderRadius: 20,
            fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 14,
          }}>⭐ Reseñas</div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 800, color: '#0F172A', letterSpacing: '-1.5px', marginBottom: 12 }}>
            Lo que dicen{' '}
            <span style={{ color: '#F59E0B' }}>las familias</span>
          </h2>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.75, maxWidth: 500, margin: '0 auto' }}>
            Experiencias reales de familias que visitaron el parque.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
          {/* Existing reviews */}
          {park.reviews.map((r, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [ref, vis] = useInView();
            return (
              <div key={r.id} ref={ref} style={{
                background: '#FAFCFF', border: '1.5px solid #F1F5F9',
                borderRadius: 20, padding: '24px',
                opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(20px)',
                transition: `all .5s ${i * 60}ms`,
                boxShadow: '0 2px 10px rgba(0,0,0,.04)',
              }}>
                <StarRating value={r.stars} size={16} />
                <p style={{ fontSize: 14, lineHeight: 1.75, color: '#475569',
                  margin: '14px 0', fontStyle: 'italic' }}>"{r.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36,
                    background: `linear-gradient(135deg,${park.color}18,${park.color2}18)`,
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 18, flexShrink: 0,
                  }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{r.date}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Write review form */}
          <div style={{
            background: `linear-gradient(145deg,${park.color}0a,${park.color2}0a)`,
            border: `1.5px dashed ${park.color}44`, borderRadius: 20, padding: '24px',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
              ✏️ Tu experiencia
            </div>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Tu nombre (opcional)"
              style={{
                background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 10,
                padding: '10px 14px', fontSize: 13, outline: 'none',
                fontFamily: 'Plus Jakarta Sans,sans-serif', color: '#0F172A', transition: 'border-color .2s',
              }}
              onFocus={e => e.target.style.borderColor = park.color}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
            <div>
              <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, marginBottom: 6 }}>PUNTUACIÓN</div>
              <StarRating value={stars} onChange={setStars} size={26} />
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="Cuéntanos tu visita al parque…" rows={4}
              style={{
                width: '100%', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 12,
                padding: '12px 14px', fontSize: 13, resize: 'none',
                fontFamily: 'Plus Jakarta Sans,sans-serif', outline: 'none',
                color: '#0F172A', transition: 'border-color .2s',
              }}
              onFocus={e => e.target.style.borderColor = park.color}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
            <button onClick={submit} disabled={busy} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: busy ? '#94A3B8' : `linear-gradient(135deg,${park.color},${park.color2})`,
              color: 'white', border: 'none', borderRadius: 12,
              padding: '13px', fontSize: 14, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer',
              fontFamily: 'Plus Jakarta Sans,sans-serif',
              boxShadow: busy ? 'none' : `0 6px 18px ${park.color}33`,
              transition: 'all .2s',
            }}>
              <Send size={15} /> {busy ? 'Publicando…' : 'Publicar reseña'}
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28,
          background: '#0F172A', color: 'white',
          padding: '12px 20px', borderRadius: 14,
          fontSize: 13, fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,.2)',
          zIndex: 999, animation: 'toastIn .25s ease',
        }}>{toast}</div>
      )}

      <style>{`
        @keyframes toastIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:none} }
        @media(max-width:640px){ #resenas{ padding:60px 20px !important } }
      `}</style>
    </section>
  );
}
