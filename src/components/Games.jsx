import React, { useState } from 'react';
import { X } from 'lucide-react';
import useInView from '../hooks/useInView';

function Card({ g, delay, onClick }) {
  const [ref, vis] = useInView();
  const [hov, setHov] = useState(false);

  return (
    <div ref={ref} onClick={() => onClick(g)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? g.light : 'white',
        border: `1.5px solid ${hov ? g.color + '40' : '#F1F5F9'}`,
        borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
        opacity: vis ? 1 : 0,
        transform: vis ? (hov ? 'translateY(-5px)' : 'translateY(0)') : 'translateY(22px)',
        transition: `all .4s ${delay}ms`,
        boxShadow: hov ? `0 12px 28px ${g.color}1a` : '0 2px 8px rgba(0,0,0,.04)',
      }}>

      {/* Photo or icon area */}
      {g.photo
        ? <div style={{ height: 130, overflow: 'hidden' }}>
            <img src={g.photo} alt={g.name} style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform .45s',
            }} />
          </div>
        : <div style={{ height: 72, background: g.light,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
            {g.emoji}
          </div>
      }

      <div style={{ padding: g.photo ? '12px 14px 16px' : '10px 14px 16px' }}>
        {g.tag && (
          <div style={{
            display: 'inline-block', marginBottom: 6,
            background: g.light, color: g.color, border: `1px solid ${g.color}30`,
            borderRadius: 20, padding: '2px 8px',
            fontSize: 9, fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase',
          }}>{g.tag}</div>
        )}
        {!g.photo && (
          <div style={{
            width: 46, height: 46, background: g.light, border: `1.5px solid ${g.color}22`,
            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, marginBottom: 10, boxShadow: `0 4px 10px ${g.color}12`,
          }}>{g.emoji}</div>
        )}
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700,
          color: '#0F172A', marginBottom: 5, lineHeight: 1.3 }}>{g.name}</div>
        <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>
          {(g.shortDesc || g.desc || '').slice(0, 72)}{(g.shortDesc || g.desc || '').length > 72 ? '…' : ''}
        </div>
      </div>
    </div>
  );
}

function Modal({ g, onClose }) {
  if (!g) return null;
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,23,42,.92)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40, cursor: 'zoom-out',
        animation: 'fadeIn .2s ease-out'
      }}
    >
      {g.photo ? (
        <img src={g.photo} alt={g.name} style={{
          maxWidth: '100%', maxHeight: '100%', borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,.6)',
          animation: 'zoomIn .2s ease-out', objectFit: 'contain'
        }} />
      ) : (
        <div style={{
          width: 300, height: 300, borderRadius: 20,
          background: g.light || '#EFF6FF', border: `2px solid ${g.color || '#ccc'}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 120, animation: 'zoomIn .2s ease-out'
        }}>{g.emoji}</div>
      )}
      <div style={{ position: 'absolute', top: 24, right: 32, color: 'rgba(255,255,255,.6)', fontSize: 48, fontWeight: 300 }}>&times;</div>
    </div>
  );
}

export default function Games({ park }) {
  const [filter,   setFilter]   = useState('Todos');
  const [selected, setSelected] = useState(null);
  const [hRef, hVis] = useInView();

  const tags = ['Todos', ...new Set(park.games.filter(g => g.tag && g.tag !== 'General').map(g => g.tag))];
  const list = filter === 'Todos' ? park.games : park.games.filter(g => g.tag === filter);

  return (
    <section id="juegos" style={{ padding: '100px 48px', background: '#F8FAFF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div ref={hRef} style={{
          textAlign: 'center', marginBottom: 48,
          opacity: hVis ? 1 : 0, transform: hVis ? 'none' : 'translateY(24px)', transition: 'all .6s',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${park.color}12`, border: `1px solid ${park.color}22`,
            color: park.color, padding: '5px 14px', borderRadius: 20,
            fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 14,
          }}>🎢 Equipamiento</div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 800, color: '#0F172A', letterSpacing: '-1.5px', marginBottom: 12 }}>
            {park.games.length} juegos para{' '}
            <span style={{ color: park.color }}>todos los niños</span>
          </h2>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Cada elemento garantiza accesibilidad plena y máximo valor lúdico.
            Toca cualquier juego para ver su imagen ampliada.
          </p>
        </div>

        {/* Filter chips */}
        {tags.length > 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            {tags.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: '8px 18px', borderRadius: 30,
                background: filter === c ? park.color : 'white',
                color: filter === c ? 'white' : '#475569',
                border: `1.5px solid ${filter === c ? park.color : '#E2E8F0'}`,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans,sans-serif',
                boxShadow: filter === c ? `0 4px 12px ${park.color}33` : 'none',
                transition: 'all .2s',
              }}>{c}</button>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 14 }}>
          {list.map((g, i) => (
            <Card key={g.id} g={g} delay={i * 35} onClick={setSelected} />
          ))}
        </div>
      </div>

      <Modal g={selected} onClose={() => setSelected(null)} />

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes zoomIn { from{transform:scale(.95)} to{transform:scale(1)} }
        @media(max-width:640px){ #juegos{ padding:60px 20px !important } }
      `}</style>
    </section>
  );
}
