/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Navigation, MapPin, X } from 'lucide-react';
import useInView from '../hooks/useInView';

export default function MapSection({ park }) {
  const mapEl  = useRef(null);
  const mapObj = useRef(null);
  const [sel,  setSel]  = useState(null);
  const [hRef, hVis]    = useInView();
  const [mRef, mVis]    = useInView();

// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!mVis || mapObj.current) return;
    const L = window.L;
    if (!L) return;

    mapObj.current = L.map(mapEl.current, { zoomControl: true, scrollWheelZoom: false })
      .setView([park.lat, park.lng], 16.5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapObj.current);

    // Area circle
    L.circle([park.lat, park.lng], {
      radius: 80, color: park.color, fillColor: park.color,
      fillOpacity: .12, weight: 2.5, dashArray: '7,5',
    }).addTo(mapObj.current);

    // Main park pin
    const mainIcon = L.divIcon({
      html: `<div style="width:48px;height:48px;border-radius:50%;background:${park.color};border:3px solid white;box-shadow:0 3px 14px ${park.color}66;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer">${park.emoji}</div>`,
      iconSize: [48, 48], iconAnchor: [24, 24], className: '',
    });
    L.marker([park.lat, park.lng], { icon: mainIcon })
      .addTo(mapObj.current)
      .on('click', () => setSel({
        emoji: park.emoji, title: park.name, desc: park.address,
        color: park.color, photo: park.coverUrl,
      }));

    // Zone markers
    park.mapPoints.forEach(pt => {
      const sz = pt.size || 34;
      const icon = L.divIcon({
        html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${pt.color};border:3px solid white;box-shadow:0 3px 12px ${pt.color}55;display:flex;align-items:center;justify-content:center;font-size:${Math.round(sz * .42)}px;cursor:pointer;transition:transform .18s" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform=''">${pt.emoji}</div>`,
        iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2], className: '',
      });
      L.marker([pt.lat, pt.lng], { icon })
        .addTo(mapObj.current)
        .on('click', () => setSel(pt));
    });

    setTimeout(() => mapObj.current?.invalidateSize(), 150);
  }, [mVis]);

  useEffect(() => () => {
    if (mapObj.current) { mapObj.current.remove(); mapObj.current = null; }
  }, [park.id]);

  const steps = [
    { n: 1, t: 'Conduce o camina', d: `Dirígete a ${park.address}, ${park.city}.` },
    { n: 2, t: 'Aparca fácil',     d: 'Plazas PMR señalizadas justo frente al parque.' },
    { n: 3, t: 'Entra',            d: `${park.mapPoints.filter(p => p.type === 'entrance').length || 4} entradas accesibles, todas adaptadas.` },
  ];

  return (
    <section id="mapa" style={{ padding: '100px 48px', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div ref={hRef} style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56,
          alignItems: 'flex-start', marginBottom: 56,
          opacity: hVis ? 1 : 0, transform: hVis ? 'none' : 'translateY(24px)', transition: 'all .6s',
        }} className="map-header-grid">
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.2)',
              color: '#16A34A', padding: '5px 14px', borderRadius: 20,
              fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 14,
            }}>📍 Cómo llegar</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(26px,3.5vw,44px)',
              fontWeight: 800, color: '#0F172A', letterSpacing: '-1.5px', marginBottom: 14 }}>
              Encuéntranos<br />en <span style={{ color: park.color }}>{park.city.split(',')[0]}</span>
            </h2>
            <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.75 }}>
              {park.address} · {park.city}.<br />Con aparcamiento PMR señalizado.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map(s => (
              <div key={s.n} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                background: '#F8FAFC', borderRadius: 14, padding: '14px 16px', border: '1px solid #F1F5F9',
              }}>
                <div style={{
                  width: 30, height: 30, flexShrink: 0,
                  background: `linear-gradient(135deg,${park.color},${park.color2})`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 13, fontWeight: 800,
                }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{s.t}</div>
                  <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{s.d}</div>
                </div>
              </div>
            ))}
            <a href={park.mapsUrl} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: `linear-gradient(135deg,${park.color},${park.color2})`,
              color: 'white', textDecoration: 'none', borderRadius: 12,
              padding: '13px', fontSize: 14, fontWeight: 700,
              boxShadow: `0 6px 20px ${park.color}33`,
              fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'transform .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
              <Navigation size={16} /> Abrir en Google Maps
            </a>
          </div>
        </div>

        {/* Map */}
        <div ref={mRef} style={{
          borderRadius: 24, overflow: 'hidden',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 8px 40px rgba(0,0,0,.07)',
          opacity: mVis ? 1 : 0, transform: mVis ? 'none' : 'translateY(24px)',
          transition: 'all .7s .15s',
        }}>
          {/* Top bar */}
          <div style={{
            padding: '14px 20px', background: 'white', borderBottom: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 9, height: 9, borderRadius: '50%', background: '#22C55E',
                boxShadow: '0 0 0 3px rgba(34,197,94,.18)', animation: 'pulse 2s infinite',
              }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{park.name}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{park.address}</div>
              </div>
            </div>
            <a href={park.mapsUrl} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: `${park.color}12`, color: park.color,
              border: `1.5px solid ${park.color}28`, borderRadius: 8,
              padding: '7px 14px', fontSize: 12, fontWeight: 700,
              textDecoration: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif',
            }}><MapPin size={12} /> Ir al parque</a>
          </div>

          {/* Leaflet container */}
          <div style={{ position: 'relative' }}>
            <div ref={mapEl} style={{ height: 460, width: '100%' }} />

            {/* Selected point popup */}
            {sel && (
              <div style={{
                position: 'absolute', bottom: 14, left: 14, right: 14, zIndex: 10,
                background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(14px)',
                border: `1.5px solid ${sel.color || park.color}28`, borderRadius: 16,
                padding: '13px 15px', boxShadow: '0 8px 30px rgba(0,0,0,.1)',
                display: 'flex', alignItems: 'center', gap: 12,
                animation: 'fadeUp .2s ease',
              }}>
                {sel.photo
                  ? <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={sel.photo} alt={sel.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  : <div style={{
                      width: 44, height: 44, background: (sel.color || park.color) + '16',
                      borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, flexShrink: 0,
                    }}>{sel.emoji}</div>
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: sel.color || park.color }}>{sel.title || sel.label}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{sel.desc}</div>
                </div>
                <button onClick={() => setSel(null)} style={{
                  width: 26, height: 26, background: '#F8FAFC', border: '1px solid #E2E8F0',
                  borderRadius: '50%', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}><X size={12} color="#64748B" /></button>
              </div>
            )}
          </div>

          {/* Legend */}
          <div style={{
            padding: '12px 20px', background: '#FAFCFF', borderTop: '1px solid #F1F5F9',
            display: 'flex', gap: 20, flexWrap: 'wrap',
          }}>
            {[
              [park.color,  park.name],
              ['#16A34A',   'Entradas accesibles'],
              ['#D97706',   'Parking PMR'],
              ['#8B5CF6',   'Juegos y Atracciones'],
              ['#0EA5E9',   'Zonas de descanso'],
            ].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: c, flexShrink: 0 }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @media(max-width:900px){
          .map-header-grid{ grid-template-columns:1fr !important; gap:32px !important }
          #mapa{ padding:60px 20px !important }
        }
      `}</style>
    </section>
  );
}
