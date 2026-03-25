import React, { useState } from 'react';
import { Info, Clock, Globe, MapPin } from 'lucide-react';
import useInView from '../hooks/useInView';

export default function ParkInfo({ park }) {
  const [ref, vis] = useInView();
  const [expandedImg, setExpandedImg] = useState(null);

  return (
    <section id="info" style={{ padding: '100px 48px', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={ref} style={{
          maxWidth: 800, margin: '0 auto', /* centered container */
          opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(28px)', transition: 'all .7s',
        }} className="info-grid">

          {/* Right text (now the only content) */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: `${park.color}10`, border: `1px solid ${park.color}28`,
              color: park.color, padding: '5px 14px', borderRadius: 20,
              fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 14,
            }}>
              <Info size={11} /> Sobre el parque
            </div>
            <h2 style={{
              fontFamily: 'Syne,sans-serif', fontSize: 'clamp(26px,3.5vw,42px)',
              fontWeight: 800, color: '#0F172A', letterSpacing: '-1.5px',
              lineHeight: 1.1, marginBottom: 18,
            }}>
              Un espacio para<br />
              <span style={{ color: park.color }}>la inclusión total</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {[
                { icon: <MapPin size={16} color={park.color} />, label: 'Dirección', value: `${park.address}, ${park.city}`, bg: `${park.color}10`, border: `${park.color}28` },
                { icon: <Clock  size={16} color="#16A34A"    />, label: 'Entrada',   value: 'Gratuita · Acceso libre',        bg: '#F0FDF4',          border: '#BBF7D0'          },
                { icon: <Globe  size={16} color="#7C3AED"    />, label: 'Inclusivo', value: park.isInclusive ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><img src="/Grupo.svg" alt="Inclusivo" style={{ width: 16, height: 16 }} /> {park.isInclusive}</span> : 'Consultar accesibilidad', bg: '#F5F3FF', border: '#DDD6FE' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: item.bg, border: `1px solid ${item.border}`,
                  borderRadius: 12, padding: '12px 16px',
                }}>
                  {item.icon}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8',
                      letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 1 }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FOTOS ADICIONALES */}
            {(park.photo2Url || park.photo3Url) && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {park.photo2Url && (
                  <div onClick={() => setExpandedImg(park.photo2Url)} style={{ width: 'calc(50% - 6px)', height: 160, borderRadius: 12, overflow: 'hidden', cursor: 'zoom-in', border: `1px solid ${park.color}20` }}>
                    <img src={park.photo2Url} alt="Foto 2" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
                  </div>
                )}
                {park.photo3Url && (
                  <div onClick={() => setExpandedImg(park.photo3Url)} style={{ width: park.photo2Url ? 'calc(50% - 6px)' : '100%', height: 160, borderRadius: 12, overflow: 'hidden', cursor: 'zoom-in', border: `1px solid ${park.color}20` }}>
                    <img src={park.photo3Url} alt="Foto 3" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Lightbox */}
      {expandedImg && (
        <div 
          onClick={() => setExpandedImg(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(15,23,42,.92)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 40, cursor: 'zoom-out',
            animation: 'fadeIn .2s ease-out'
          }}
        >
          <img src={expandedImg} alt="Ampliada" style={{
            maxWidth: '100%', maxHeight: '100%', borderRadius: 20,
            boxShadow: '0 24px 80px rgba(0,0,0,.6)',
            animation: 'zoomIn .2s ease-out'
          }} />
          <div style={{ position: 'absolute', top: 24, right: 32, color: 'rgba(255,255,255,.6)', fontSize: 48, fontWeight: 300 }}>&times;</div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes zoomIn { from{transform:scale(.95)} to{transform:scale(1)} }
        @media(max-width:900px){
          .info-grid{ grid-template-columns:1fr !important; gap:40px !important }
          #info{ padding:60px 24px !important }
        }
      `}</style>
    </section>
  );
}
