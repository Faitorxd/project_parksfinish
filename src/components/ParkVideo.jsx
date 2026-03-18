import React from 'react';
import { Play } from 'lucide-react';
import useInView from '../hooks/useInView';

export default function ParkVideo({ park }) {
  const [ref, vis] = useInView();

  if (!park.youtubeUrl) return null;

  return (
    <section style={{ padding: '80px 48px', background: '#FAFCFF', borderTop: '1px solid #F1F5F9' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div ref={ref} style={{
          opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(28px)', transition: 'all .7s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${park.color}10`, border: `1px solid ${park.color}28`,
            color: park.color, padding: '5px 14px', borderRadius: 20,
            fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 14,
          }}>
            <Play size={11} fill="currentColor" /> Conoce más
          </div>
          
          <h2 style={{
            fontFamily: 'Syne,sans-serif', fontSize: 'clamp(24px,3.5vw,36px)',
            fontWeight: 800, color: '#0F172A', letterSpacing: '-1px',
            lineHeight: 1.2, marginBottom: 40,
          }}>
            Video <span style={{ color: park.color }}>Promocional</span>
          </h2>

          <div style={{ 
            width: '100%', 
            maxWidth: 860,
            aspectRatio: '16/9', 
            borderRadius: 24, 
            overflow: 'hidden', 
            border: `1.5px solid ${park.color}20`,
            boxShadow: `0 24px 60px ${park.color}15`,
            background: '#0F172A',
            position: 'relative'
          }}>
            <iframe 
              width="100%" 
              height="100%" 
              src={
                park.youtubeUrl.includes('youtube.com/watch') 
                ? `https://www.youtube.com/embed/${new URLSearchParams(new URL(park.youtubeUrl).search).get('v')}?rel=0`
                : park.youtubeUrl.includes('youtu.be/')
                ? `https://www.youtube.com/embed/${park.youtubeUrl.split('youtu.be/')[1]}?rel=0`
                : park.youtubeUrl
              }
              title={`Video descriptivo de ${park.name}`}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              style={{ position: 'absolute', inset: 0 }}
            ></iframe>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){
          section{ padding: 60px 24px !important; }
        }
      `}</style>
    </section>
  );
}
