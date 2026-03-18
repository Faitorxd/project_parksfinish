import React from 'react';
import { MapPin } from 'lucide-react';
import FloatingPdfButton from './FloatingPdfButton';

export default function Landing({ onStart }) {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F6FBF7', 
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Syne, sans-serif'
    }}>
      {/* Decorative circles */}
      <div style={{position: 'absolute', top: -40, left: -40, width: 250, height: 250, borderRadius: '50%', background: '#E6F4EA', opacity: 0.6}} />
      <div style={{position: 'absolute', top: '20%', right: '10%', width: 120, height: 120, borderRadius: '50%', background: '#FDF6E3', opacity: 0.8}} />
      <div style={{position: 'absolute', bottom: '15%', left: '15%', width: 150, height: 150, borderRadius: '50%', background: '#FBEBE8', opacity: 0.8}} />

      {/* Main Content */}
      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'white', padding: '8px 20px', borderRadius: 30,
          fontSize: 13, fontWeight: 700, color: '#2B836B', marginBottom: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          <MapPin size={15} /> AYUNTAMIENTO DE YAIZA
        </div>

        <style>{`
          @keyframes fadeIn { from{opacity:0} to{opacity:1} }
          @keyframes floatUpDown { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        `}</style>

        <h1 style={{
          fontSize: 52, fontWeight: 800,
          color: '#135147', margin: '0 0 4px 0', letterSpacing: '-1px'
        }}>
          PLayYaiza
        </h1>
        <p style={{
          fontSize: 18, color: '#64748B', margin: '0 0 40px 0',
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500
        }}>
          Parques Infantiles de Yaiza
        </p>

        {/* Volcano Container */}
        <div style={{
          width: 320, height: 320, background: '#EAE1DB',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', marginBottom: 40
        }}>
          <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 24, color: '#F59E0B' }}>✨</div>
          <img src="/image(1).png" alt="Volcano Logo" style={{ width: '85%', height: 'auto', objectFit: 'contain' }} />
        </div>

        <button onClick={onStart} style={{
          background: '#38C18C', 
          color: 'white', fontSize: 18, fontWeight: 800, padding: '16px 48px',
          borderRadius: 40, border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(56, 193, 140, 0.3)',
          display: 'flex', alignItems: 'center', gap: 10,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(56, 193, 140, 0.4)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(56, 193, 140, 0.3)'; }}>
          🎢 ¡Vamos a jugar!
        </button>

        <p style={{
          marginTop: 30, fontSize: 13, color: '#94A3B8', maxWidth: 280, 
          lineHeight: 1.5, textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          Descubre todos los parques infantiles del municipio de Yaiza
        </p>

      </div>
      
      {/* Bottom waves */}
      <div style={{ position: 'absolute', bottom: -50, left: 0, right: 0, height: 150, background: 'rgba(230,244,234,0.5)', borderRadius: '50% 50% 0 0 / 100% 100% 0 0', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: 0, right: 0, height: 150, background: '#E6F4EA', borderRadius: '50% 50% 0 0 / 100% 100% 0 0', zIndex: 1, pointerEvents: 'none' }} />
      
      <FloatingPdfButton parkColor="#10B981" />
    </div>
  );
}
