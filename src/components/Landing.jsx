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
      backgroundImage: 'url(/Fondo1.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Syne, sans-serif'
    }}>
      {/* Custom Background Graphic */}

      {/* Main Content */}
      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <a 
          href="https://yaiza.es/" 
          target="_blank" 
          rel="noreferrer"
          style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'white', padding: '8px 20px', borderRadius: 30,
          fontSize: 13, fontWeight: 700, color: '#2B836B', marginBottom: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          textDecoration: 'none', transition: 'transform 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = ''}>
          <MapPin size={15} /> AYUNTAMIENTO DE YAIZA
        </a>

        <style>{`
          @keyframes fadeIn { from{opacity:0} to{opacity:1} }
          @keyframes floatUpDown { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        `}</style>

        <img 
          src="/PLAY YAIZA.png" 
          alt="PlayYaiza Logo" 
          style={{ height: 110, marginBottom: 40, objectFit: 'contain' }} 
        />

        {/* Volcano Container */}
        <div style={{
          width: 320, height: 320,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', marginBottom: 40,
          animation: 'floatUpDown 3s ease-in-out infinite',
        }}>
          <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 24, color: '#F59E0B' }}>✨</div>
          <img src="/image(1).png" alt="Volcano Logo" style={{ width: '85%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.15))' }} />
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
      
      
      <FloatingPdfButton parkColor="#10B981" />
    </div>
  );
}
