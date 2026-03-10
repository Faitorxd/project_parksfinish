import React from 'react';
import { Info, Clock, Globe, MapPin } from 'lucide-react';
import useInView from '../hooks/useInView';

const HOURS = [
  { day: 'Lunes – Viernes', time: '08:00 – 21:00' },
  { day: 'Sábados',         time: '08:00 – 22:00' },
  { day: 'Domingos',        time: '09:00 – 21:00' },
];

export default function ParkInfo({ park }) {
  const [ref, vis] = useInView();

  return (
    <section id="info" style={{ padding: '100px 48px', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={ref} style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center',
          opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(28px)', transition: 'all .7s',
        }} className="info-grid">

          {/* Left visual */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: '-16px -16px 16px 16px',
              background: `linear-gradient(135deg,${park.color}12,${park.color2}12)`,
              borderRadius: 28, zIndex: 0,
            }} />
            <div style={{
              position: 'relative', zIndex: 1, background: 'white', borderRadius: 24,
              border: `1.5px solid ${park.color}20`, overflow: 'hidden',
              boxShadow: `0 12px 40px ${park.color}16`,
            }}>
              <div style={{ height: 8, background: `linear-gradient(90deg,${park.color},${park.color2})` }} />
              {park.coverUrl
                ? <img src={park.coverUrl} alt={park.name}
                    style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
                : <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `linear-gradient(135deg,${park.color}10,${park.color2}10)`, fontSize: 80 }}>
                    {park.emoji}
                  </div>
              }
              <div style={{ padding: '24px 28px' }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 800,
                  color: '#0F172A', marginBottom: 8, textAlign: 'center' }}>{park.name}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.75,
                  textAlign: 'center', marginBottom: 20 }}>{park.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                  {park.tags.slice(0, 5).map((t, i) => (
                    <span key={i} style={{
                      background: `${park.color}12`, color: park.color,
                      border: `1px solid ${park.color}25`, borderRadius: 20,
                      padding: '5px 12px', fontSize: 12, fontWeight: 600,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid #F1F5F9', padding: '16px 28px',
                display: 'flex', alignItems: 'center', gap: 8, background: '#FAFCFF' }}>
                <MapPin size={14} color={park.color} strokeWidth={2.5} />
                <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                  {park.address}, {park.city}
                </span>
              </div>
            </div>
          </div>

          {/* Right text */}
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
            <p style={{ fontSize: 15, lineHeight: 1.85, color: '#64748B', marginBottom: 32 }}>
              {park.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {[
                { icon: <MapPin size={16} color={park.color} />, label: 'Dirección', value: `${park.address}, ${park.city}`, bg: `${park.color}10`, border: `${park.color}28` },
                { icon: <Clock  size={16} color="#16A34A"    />, label: 'Entrada',   value: 'Gratuita · Acceso libre',        bg: '#F0FDF4',          border: '#BBF7D0'          },
                { icon: <Globe  size={16} color="#7C3AED"    />, label: 'Premio',    value: `${park.badge} · Inclusividad`,   bg: '#F5F3FF',          border: '#DDD6FE'          },
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

            <div style={{ background: '#FAFCFF', borderRadius: 14, border: '1px solid #F1F5F9', padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Clock size={14} color={park.color} />
                <span style={{ fontSize: 12, fontWeight: 700, color: park.color,
                  letterSpacing: '.5px', textTransform: 'uppercase' }}>Horario orientativo</span>
              </div>
              {HOURS.map(h => (
                <div key={h.day} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '7px 0', borderBottom: '1px solid #F8FAFC',
                }}>
                  <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{h.day}</span>
                  <span style={{ fontSize: 13, color: park.color, fontWeight: 700 }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){
          .info-grid{ grid-template-columns:1fr !important; gap:40px !important }
          #info{ padding:60px 24px !important }
        }
      `}</style>
    </section>
  );
}
