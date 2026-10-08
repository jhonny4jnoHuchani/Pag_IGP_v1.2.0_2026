import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import {
  FaFacebookF,
  FaWhatsapp,
} from 'react-icons/fa6';
import { FiChevronDown } from 'react-icons/fi';
import type { InstitucionPrincipal, Portada } from '../../lib/api';

/**
 * Función auxiliar para obtener la URL de imagen de manera segura
 */
const getImageUrl = (filename: string | null | undefined): string => {
  return filename || '';
};

interface HeroSectionProps {
  institucion: InstitucionPrincipal | null;
  portadas: Portada[] | undefined;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

/**
 * -------------------------------------------------------------------
 * Componente HeroSection
 * Representa la primera vista del Landing Page de la carrera
 * -------------------------------------------------------------------
 */
const HeroSection = ({ institucion, portadas, colors }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Autoplay del hero (portada)
  useEffect(() => {
    if (!portadas || portadas.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (!portadas || prev >= portadas.length - 1) return 0;
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [portadas]);

  const whatsappNumber =
    institucion?.institucion_celular1 && institucion.institucion_celular1 !== 2147483647
      ? institucion.institucion_celular1
      : null;

  const tituloCompleto = institucion?.institucion_nombre || 'INGENIERÍA DE GAS Y PETROQUÍMICA';
  const palabras = tituloCompleto.split(' ');
  const mitad = Math.ceil(palabras.length / 2);
  const linea1 = palabras.slice(0, mitad).join(' ');
  const linea2 = palabras.slice(mitad).join(' ');

  return (
    <section
      id="inicio"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes fadeSlide { from { opacity: 0; transform: scale(1.02); } to { opacity: 1; transform: scale(1); } }

        /* Botones sociales flotantes */
        .floating-social {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 100;
        }
        @media (max-width: 640px) {
          .floating-social {
            bottom: 1rem;
            right: 1rem;
            gap: 0.75rem;
          }
          .floating-social a {
            width: 46px !important;
            height: 46px !important;
          }
        }

        /* Animación de Dibujado SVG */
        .svg-title-anim {
          font-family: "Inter", system-ui, sans-serif;
          font-size: 75px;
          font-weight: 900;
          text-transform: uppercase;
          fill: transparent;
          stroke: #FFD700;
          stroke-width: 2px;
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: drawText 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));
          letter-spacing: 2px;
        }

        @keyframes drawText {
          0% {
            stroke-dashoffset: 600;
            fill: transparent;
          }
          60% {
            stroke-dashoffset: 0;
            fill: transparent;
          }
          100% {
            stroke-dashoffset: 0;
            fill: #FFD700;
          }
        }
      `}</style>

      {/* FONDO DEL SLIDER */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -2 }}>
        {portadas && portadas.length > 0 ? (
          portadas.map((portada, index) => (
            <div
              key={portada.portada_id}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                opacity: index === currentSlide ? 1 : 0, transition: 'opacity 1s ease-in-out',
                zIndex: index === currentSlide ? 1 : 0, animation: index === currentSlide ? 'fadeSlide 1s ease-out' : 'none',
              }}
            >
              <img
                src={portada.portada_imagen}
                alt={portada.portada_titulo || `Portada ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))
        ) : (
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.secondary}40 100%)` }}></div>
        )}
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: -1 }}></div>

      {/* DECORADORES */}
      <img src="/decoradores/esquina-derecha.png" alt="" style={{ position: 'absolute', bottom: 0, right: 0, width: 'clamp(350px, 100vw, 500px)', height: 'auto', pointerEvents: 'none', zIndex: 1 }} />
      <img src="/decoradores/esquina-derecha_invertido.png" alt="" style={{ position: 'absolute', bottom: 0, left: 0, width: 'clamp(350px, 100vw, 500px)', height: 'auto', pointerEvents: 'none', zIndex: 1 }} />
      <img src="/decoradores/decor_mov2.gif" alt="" style={{ position: 'absolute', top: '56%', left: '85%', transform: 'translateX(-50%)', width: 'clamp(120px, 20vw, 250px)', height: 'auto', pointerEvents: 'none', zIndex: 1, opacity: 0.85 }} />
      <img src="/decoradores/decor_mov2.gif" alt="" style={{ position: 'absolute', top: '35%', left: '15%', transform: 'translateX(-50%)', width: 'clamp(120px, 20vw, 250px)', height: 'auto', pointerEvents: 'none', zIndex: 1, opacity: 0.85 }} />

      {/* CONTENIDO (Logo y Título) */}
      <div style={{ textAlign: 'center', color: '#fff', padding: 'clamp(0.5rem, 2vw, 1rem)', maxWidth: 'clamp(320px, 92vw, 1100px)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(0.5rem, 2vw, 1.5rem)', animation: 'fadeInUp 1s ease-out' }}>
          
          <div
            className="logo-pulse"
            style={{
              width: 'clamp(120px, 28vw, 200px)', height: 'clamp(120px, 28vw, 200px)', margin: '0 auto 1.5rem', background: '#fff', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              border: `5px solid ${colors.primary}`, animation: 'pulse 2s ease-in-out infinite', overflow: 'hidden',
            }}
          >
            {institucion?.institucion_logo ? (
              <img src={getImageUrl(institucion.institucion_logo)} alt="Logo Institucional" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, color: colors.primary }}>IGP</span>
            )}
          </div>

          <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            {tituloCompleto}
          </h1>

          <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto 1.5rem' }}>
            <svg viewBox="0 0 1000 220" width="100%" height="100%" style={{ overflow: 'visible' }}>
              <text x="50%" y="35%" dominantBaseline="middle" textAnchor="middle" className="svg-title-anim">
                {linea1}
              </text>
              <text x="50%" y="85%" dominantBaseline="middle" textAnchor="middle" className="svg-title-anim" style={{ animationDelay: '0.3s' }}>
                {linea2}
              </text>
            </svg>
          </div>

          {/* Botones del slider */}
          {portadas && portadas.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              {portadas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: index === currentSlide ? '40px' : '12px', height: '12px', borderRadius: '6px',
                    background: index === currentSlide ? colors.primary : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer',
                    transition: 'all 0.3s ease', boxShadow: index === currentSlide ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                  }}
                  aria-label={`Ir a portada ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator animado */}
      <motion.a
        href="#explora-nuestra-institucion"
        aria-label="Desplázate hacia abajo"
        style={{
          position: 'absolute', bottom: '2rem', left: '50%', translateX: '-50%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
          color: '#fff', zIndex: 2, textDecoration: 'none', opacity: 0.85,
        }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>Descubre más</span>
        <FiChevronDown size={26} />
      </motion.a>

      {/* Flotantes sociales */}
      <div className="floating-social">
        {institucion?.institucion_facebook && (
          <a
            href={institucion.institucion_facebook}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '55px', height: '55px', background: '#1877F2', borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(24,119,242,0.4)', transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(24,119,242,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(24,119,242,0.4)'; }}
          >
            <FaFacebookF size={22} color="#fff" />
          </a>
        )}
        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '55px', height: '55px', background: '#25D366', borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <FaWhatsapp size={26} color="#fff" />
          </a>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
