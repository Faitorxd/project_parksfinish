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
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)',
      backdropFilter: 'blur(8px)', zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: 'white', borderRadius: 28, maxWidth: 460, width: '100%',
        boxShadow: '0 32px 80px rgba(0,0,0,.18)',
        border: `1.5px solid ${g.color}25`,
        animation: 'popUp .3s cubic-bezier(.34,1.56,.64,1)',
        overflow: 'hidden',
      }}>
        {/* Photo header */}
        {g.photo
          ? <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
              <img src={g.photo} alt={g.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 55%)' }} />
              <button onClick={onClose} style={{
                position: 'absolute', top: 14, right: 14,
                background: 'rgba(255,255,255,.9)', border: 'none', borderRadius: 10,
                width: 32, height: 32, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><X size={15} color="#64748B" /></button>
            </div>
          : <div style={{ padding: '28px 36px 0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{
                background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10,
                width: 32, height: 32, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><X size={15} color="#64748B" /></button>
            </div>
        }
        <div style={{ padding: g.photo ? '20px 36px 36px' : '0 36px 36px' }}>
          {!g.photo && (
            <div style={{
              width: 68, height: 68, background: g.light, border: `1.5px solid ${g.color}30`,
              borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, margin: '0 auto 14px',
            }}>{g.emoji}</div>
          )}
          {g.tag && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <span style={{ background: g.light, color: g.color, border: `1px solid ${g.color}28`,
                borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700,
                letterSpacing: '.4px', textTransform: 'uppercase' }}>{g.tag}</span>
            </div>
          )}
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800,
            color: '#0F172A', textAlign: 'center', marginBottom: 12 }}>{g.name}</h3>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#475569',
            textAlign: 'center', marginBottom: 24 }}>{g.fullDesc || g.desc}</p>
          <button onClick={onClose} style={{
            width: '100%', padding: 13,
            background: `linear-gradient(135deg,${g.color},${g.color}bb)`,
            color: 'white', border: 'none', borderRadius: 12,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans,sans-serif',
          }}>Cerrar</button>
        </div>
      </div>
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
            Toca cualquier juego para saber más.
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
        @keyframes popUp { from{opacity:0;transform:scale(.88) translateY(20px)} to{opacity:1;transform:none} }
        @media(max-width:640px){ #juegos{ padding:60px 20px !important } }
      `}</style>
    </section>
  );
}
