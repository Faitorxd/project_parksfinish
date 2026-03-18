import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';

export default function FloatingPdfButton({ parkColor }) {
  const [showPdf, setShowPdf] = useState(false);
  const color = parkColor || '#0284C7';

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setShowPdf(true)}
        title="Ver Guía Técnica PDF"
        style={{
          position: 'fixed', bottom: 30, right: 30, zIndex: 900,
          background: `linear-gradient(135deg,${color},${color}dd)`,
          color: 'white', border: 'none', borderRadius: '50%',
          width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 24px ${color}66`, cursor: 'pointer',
          transition: 'transform .23s cubic-bezier(.4,0,.2,1), box-shadow .23s',
          animation: 'fadeUp .5s 1s both'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
          e.currentTarget.style.boxShadow = `0 12px 28px ${color}88`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = `0 8px 24px ${color}66`;
        }}
      >
        <BookOpen size={24} strokeWidth={2.5} />
      </button>

      {/* Fullscreen PDF Modal Overlay */}
      {showPdf && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(15,23,42,.85)', backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column',
          padding: '24px 40px 40px',
          animation: 'fadeIn .2s ease-out',
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => setShowPdf(false)} style={{
              background: 'white', border: 'none', borderRadius: '50%',
              width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,.15)',
              transition: 'transform .2s'
            }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
              <X size={22} />
            </button>
          </div>
          <div style={{
            flex: 1, background: '#F8FAFC', borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,.3)',
            animation: 'zoomIn .2s ease-out'
          }}>
            <iframe 
              src="/20240909_Guía técnica Ayuntamiento de Yaiza Parques infantiles inclusivos.pdf#view=FitH"
              width="100%" height="100%" 
              style={{ border: 'none', background: 'white' }}
              title="Guía técnica Parques Inclusivos"
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes zoomIn { from{transform:scale(.98)} to{transform:scale(1)} }
        @media(max-width:640px){
          button[title="Ver Guía Técnica PDF"] { bottom: 20px !important; right: 20px !important; width: 50px !important; height: 50px !important; }
        }
      `}</style>
    </>
  );
}
