/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Navigation, Info } from 'lucide-react';

export default function Hero({ parks, onParkClick }) {
  const mapEl = useRef(null);
  const mapObj = useRef(null);
  const [selPark, setSelPark] = useState(null);
  const [search, setSearch] = useState('');
  
  const activeParks = parks.filter(p => p.active);
  const filteredParks = activeParks.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const L = window.L;
    if (!L || !mapEl.current) return;

    if (!mapObj.current) {
      const centerLat = activeParks.length > 0 ? activeParks[0].lat : 28.9;
      const centerLng = activeParks.length > 0 ? activeParks[0].lng : -13.8;
      
      mapObj.current = L.map(mapEl.current, { zoomControl: false }).setView([centerLat, centerLng], 12);
      L.control.zoom({ position: 'topright' }).addTo(mapObj.current);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapObj.current);
    }

    // Clear existing markers
    mapObj.current.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        mapObj.current.removeLayer(layer);
      }
    });

    // Add markers
    filteredParks.forEach(park => {
      const icon = L.divIcon({
        html: `<div style="width:40px;height:40px;border-radius:50%;background:${park.color};border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;transition:transform 0.2s" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${park.emoji}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        className: ''
      });

      L.marker([park.lat, park.lng], { icon })
        .addTo(mapObj.current)
        .on('click', () => {
          setSelPark(park);
          mapObj.current.setView([park.lat, park.lng], 16, { animate: true });
        });
    });

  }, [filteredParks]); 

  const handleParkClick = (park) => {
    setSelPark(park);
    if (mapObj.current && window.L) {
      mapObj.current.setView([park.lat, park.lng], 16, { animate: true });
    }
  };

  return (
    <div className="hero-container" style={{ display: 'flex', height: '100vh', width: '100vw', paddingTop: 64, overflow: 'hidden', background: '#F8FAFC' }}>
      
      {/* Sidebar Panel */}
      <div className="hero-sidebar" style={{ width: 440, height: '100%', background: 'white', display: 'flex', flexDirection: 'column', zIndex: 10, boxShadow: '4px 0 24px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #F1F5F9' }}>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Descubre Parques</h1>
          
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Buscar parque o municipio..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 15, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, boxSizing: 'border-box' }}>
          {filteredParks.length > 0 ? filteredParks.map(park => (
            <div 
              key={park.id}
              onClick={() => handleParkClick(park)}
              style={{ padding: 16, borderRadius: 16, cursor: 'pointer', marginBottom: 10, border: `2px solid ${selPark?.id === park.id ? park.color : '#F1F5F9'}`, background: selPark?.id === park.id ? `${park.color}0A` : 'white', transition: 'border 0.2s, box-shadow 0.2s', boxShadow: selPark?.id === park.id ? `0 4px 12px ${park.color}20` : '0 2px 8px rgba(0,0,0,0.02)' }}
            >
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: 14, background: park.coverUrl ? 'none' : `linear-gradient(135deg,${park.color},${park.color2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0, overflow: 'hidden' }}>
                  {park.coverUrl ? (
                    <img src={park.coverUrl} alt={park.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    park.emoji
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>{park.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>
                    <MapPin size={13} color={park.color} /> {park.city}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#F59E0B' }}>⭐</span> {park.rating} ({park.reviewCount})
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: park.color, background: `${park.color}15`, padding: '4px 8px', borderRadius: 12 }}>
                      {park.games?.length || 0} juegos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
              No se encontraron parques.
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="hero-map" style={{ flex: 1, position: 'relative' }}>
        <div ref={mapEl} style={{ width: '100%', height: '100%', zIndex: 1 }} />
        
        {/* Selected Park Overlay inside map area */}
        {selPark && (
          <div className="hero-popup" style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 400, display: 'flex', justifyContent: 'center', pointerEvents: 'none', width: '90%', maxWidth: 560 }}>
            <div className="hero-popup-content" style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(12px)', borderRadius: 24, padding: 24, display: 'flex', alignItems: 'center', gap: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.15)', pointerEvents: 'auto', width: '100%', border: `1.5px solid ${selPark.color}30` }}>
              <div className="hero-popup-img" style={{ width: 110, height: 110, borderRadius: 18, background: selPark.coverUrl ? 'none' : `linear-gradient(135deg,${selPark.color},${selPark.color2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, flexShrink: 0, overflow: 'hidden', boxShadow: `0 8px 24px ${selPark.color}40` }}>
                {selPark.coverUrl ? (
                  <img src={selPark.coverUrl} alt={selPark.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  selPark.emoji
                )}
              </div>
              
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ background: `${selPark.color}15`, color: selPark.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>{selPark.badge}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 800, color: '#F59E0B' }}>⭐ {selPark.rating}</div>
                </div>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>{selPark.name}</h3>
                <p style={{ fontSize: 14, color: '#64748B', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 16, lineHeight: 1.5 }}>{selPark.description}</p>
                
                <div className="hero-popup-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => onParkClick(selPark)}
                    style={{ background: `linear-gradient(135deg,${selPark.color},${selPark.color2})`, color: 'white', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.2s', boxShadow: `0 6px 16px ${selPark.color}40` }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                  >
                    <Info size={16} /> Ver parque
                  </button>
                  <a href={selPark.mapsUrl} target="_blank" rel="noreferrer" style={{ background: '#F1F5F9', color: '#0F172A', border: 'none', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'} onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}>
                    <Navigation size={16} /> Ruta
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
        @media(max-width: 900px) {
          .hero-container { flex-direction: column-reverse !important;  }
          .hero-sidebar { width: 100% !important; height: 50% !important; border-top: 1px solid #E2E8F0; }
          .hero-map { height: 50% !important; }
          .hero-popup { bottom: 20px !important; width: calc(100% - 40px) !important; left: 20px !important; transform: none !important; }
          .hero-popup-content { flex-direction: column !important; text-align: center !important; gap: 16px !important; padding: 20px !important; }
          .hero-popup-content > div:nth-child(2) { text-align: center !important; }
          .hero-popup-img { margin: 0 auto; width: 80px !important; height: 80px !important; font-size: 36px !important; }
          .hero-popup-actions { justify-content: center; }
          .hero-popup-content .lucide { margin: auto; }
        }
      `}</style>
    </div>
  );
}
