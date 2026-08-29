import { useState, useEffect, useMemo, type ReactNode, type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';
import { TypeAnimation } from 'react-type-animation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';



import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiDownload,
  FiExternalLink,
  FiChevronDown,
  FiLink,
} from 'react-icons/fi';
import {
  FaFacebookF,
  FaWhatsapp,
  FaYoutube,
  FaXTwitter,
} from 'react-icons/fa6';
import { FaUserTie, FaIndustry, FaCogs, FaNewspaper, FaVideo, FaRegCalendarAlt } from 'react-icons/fa';

import { useCarreraData, type Publicacion, type Autoridad, type Video } from './lib/api';
import { useThemeColors } from './hooks/useThemeColors';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';




// =============================================================
// HELPERS
// =============================================================
const getImageUrl = (filename: string | null | undefined): string => {
  return filename || '';
};

const stripHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

// =============================================================
// SUBCOMPONENTE: FadeIn (scroll animation reutilizable)
// react-intersection-observer + framer-motion
// =============================================================
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
}

function FadeIn({ children, delay = 0, y = 32, className, style }: FadeInProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  const colors = useThemeColors(institucion);

const [currentSlide, setCurrentSlide] = useState(0);
const [showLoading, setShowLoading] = useState(true);
const [contentReady, setContentReady] = useState(false); // NUEVO

    // Efecto de chispas al hacer click
useEffect(() => {
  const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500', '#fff', '#FFD700', '#FFA500'];
  let isMouseDown = false;
  let sparkInterval: ReturnType<typeof setInterval> | null = null;
  let lastX = 0;
  let lastY = 0;

  //////////////////////////////////////////////////////////EFECTO DE MACHA NEGRA QUEMADURA
  const createStain = (x: number, y: number) => {
  const stain = document.createElement('div');
  const size = 50 + Math.random() * 40;
  
  // Colores de quemadura (negro, marrón oscuro, gris ceniza)
const burnColors = [
  'rgba(0,0,0,0.4)',      // ← Negro menos intenso
  'rgba(30,15,5,0.35)',   // ← Marrón más suave
  'rgba(50,25,10,0.3)',   // ← Marrón suave
  'rgba(80,40,15,0.25)',  // ← Marrón claro
  'rgba(20,10,5,0.35)',   // ← Marrón suave
];

  stain.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 99998;
    width: ${size}px;
    height: ${size}px;
    border-radius: 45% 55% 50% 50% / 50% 45% 55% 50%;
    background: radial-gradient(
      ellipse at center,
      ${burnColors[0]} 0%,
      ${burnColors[1]} 25%,
      ${burnColors[2]} 45%,
      ${burnColors[3]} 60%,
      ${burnColors[4]} 75%,
      transparent 85%
    );
    filter: blur(1px) contrast(1.2);
    top: ${y - size / 2}px;
    left: ${x - size / 2}px;
    transform: scale(0.3) rotate(${Math.random() * 360}deg);
    transition: all 2.5s ease-out;
    animation: burnEffect 2.5s ease-out forwards;
  `;
  document.body.appendChild(stain);

  // Keyframes para la animación de quemadura
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes burnEffect {
      0% {
        transform: scale(0.3) rotate(0deg);
        opacity: 1;
        filter: blur(1px) contrast(1.2);
      }
      30% {
        transform: scale(1.2) rotate(15deg);
        opacity: 0.9;
        filter: blur(2px) contrast(1.5);
      }
      60% {
        transform: scale(1.5) rotate(25deg);
        opacity: 0.6;
        filter: blur(3px) contrast(1.8);
      }
      100% {
        transform: scale(2) rotate(35deg);
        opacity: 0;
        filter: blur(5px) contrast(2);
      }
    }
  `;
  document.head.appendChild(styleSheet);

  // Crear cenizas que caen
  for (let i = 0; i < 5; i++) {
    createAsh(x, y, size);
  }

  setTimeout(() => {
    stain.remove();
    styleSheet.remove();
  }, 2500);
};

// Cenizas que caen desde la quemadura
const createAsh = (x: number, y: number, stainSize: number) => {
  const ash = document.createElement('div');
  const ashSize = 2 + Math.random() * 4;
  const angle = Math.random() * Math.PI * 2;
  const distance = stainSize / 2 * Math.random();
  const startX = x + Math.cos(angle) * distance;
  const startY = y + Math.sin(angle) * distance;
  const fallDistance = 30 + Math.random() * 50;
  const driftX = (Math.random() - 0.5) * 30;
  
  ash.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 99997;
    width: ${ashSize}px;
    height: ${ashSize}px;
    border-radius: 50%;
    background: rgba(30,20,10,0.7);
    box-shadow: 0 0 4px rgba(50,30,15,0.5);
    top: ${startY}px;
    left: ${startX}px;
  `;
  document.body.appendChild(ash);

  ash.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
      { transform: `translate(${driftX}px, ${fallDistance}px) scale(0.3)`, opacity: 0 },
    ],
    {
      duration: 1000 + Math.random() * 800,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }
  ).onfinish = () => ash.remove();
};

  // Crear una chispa
  const createSpark = (x: number, y: number) => {
    const spark = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 2 + Math.random() * 4;
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 60;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 20;

    spark.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      box-shadow: 0 0 6px ${color}, 0 0 12px ${color}, 0 0 20px ${color};
      top: ${y}px;
      left: ${x}px;
    `;
    document.body.appendChild(spark);

    spark.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 },
      ],
      {
        duration: 400 + Math.random() * 500,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }
    ).onfinish = () => spark.remove();

    // Chispa secundaria (50% probabilidad de crear una extra)
    if (Math.random() > 0.5) {
      const spark2 = document.createElement('div');
      const color2 = ['#FFD700', '#fff', '#FFA500'][Math.floor(Math.random() * 3)];
      const size2 = 1 + Math.random() * 2;
      const angle2 = Math.random() * Math.PI * 2;
      const distance2 = 80 + Math.random() * 50;
      const dx2 = Math.cos(angle2) * distance2;
      const dy2 = Math.sin(angle2) * distance2 - 25;

      spark2.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 99999;
        width: ${size2}px;
        height: ${size2}px;
        border-radius: 50%;
        background: ${color2};
        box-shadow: 0 0 4px ${color2}, 0 0 10px ${color2};
        top: ${y}px;
        left: ${x}px;
      `;
      document.body.appendChild(spark2);

      spark2.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${dx2}px, ${dy2}px) scale(0)`, opacity: 0 },
        ],
        {
          duration: 300 + Math.random() * 400,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }
      ).onfinish = () => spark2.remove();
    }
  };

  // Ráfaga de chispas
  const burstSparks = (x: number, y: number) => {
    for (let i = 0; i < 20; i++) {  // ← 20 chispas por ráfaga
      createSpark(x, y);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    isMouseDown = true;
    lastX = e.clientX;
    lastY = e.clientY;
    createStain(e.clientX, e.clientY);
    burstSparks(e.clientX, e.clientY);

    sparkInterval = setInterval(() => {
      if (isMouseDown) {
        createSpark(lastX, lastY);  // ← Usar lastX y lastY
        if (Math.random() > 0.7) {
          createSpark(lastX, lastY);  // ← Usar lastX y lastY
        }
      }
    }, 30);
  };

    const handleMouseMove = (e: MouseEvent) => {
    if (isMouseDown) {
      lastX = e.clientX;
      lastY = e.clientY;
      // Crear chispas al arrastrar
      createSpark(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    isMouseDown = false;
    if (sparkInterval) {
      clearInterval(sparkInterval);
      sparkInterval = null;
    }
  };

  const handleClick = (e: MouseEvent) => {
    createStain(e.clientX, e.clientY);
    burstSparks(e.clientX, e.clientY);
  };

  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove); 
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('click', handleClick);
  
  return () => {
    window.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);  // ← NUEVO
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('click', handleClick);
    if (sparkInterval) clearInterval(sparkInterval);
  };
}, []);

  // Marcar contenido como listo cuando los datos estén cargados
  useEffect(() => {
    if (!loading && !error && contenido && recursos) {
      const readyTimer = setTimeout(() => {
        setContentReady(true);
      }, 300);
      
      return () => clearTimeout(readyTimer);
    }
  }, [loading, error, contenido, recursos]);

  // Autoplay del hero (portada)

  useEffect(() => {
    if (!contenido?.portada || contenido.portada.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (!contenido.portada || prev >= contenido.portada.length - 1) return 0;
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [contenido?.portada]);

  // Publicaciones ordenadas de más reciente a más antigua
  const publicacionesOrdenadas: Publicacion[] = useMemo(() => {
    const lista = recursos?.upea_publicaciones ?? [];
    return [...lista].sort(
      (a, b) => new Date(b.publicaciones_fecha).getTime() - new Date(a.publicaciones_fecha).getTime()
    );
  }, [recursos?.upea_publicaciones]);

  const videos: Video[] = contenido?.upea_videos ?? [];
  const autoridades: Autoridad[] = contenido?.autoridad ?? [];

if (loading) {
  return (
    <LoadingScreen
      institucion={institucion}
      text="Cargando"
      duration={2000} // Tiempo mínimo de visualización
      targetPageReady={contentReady}
      onFinish={() => setShowLoading(false)}
    />
  );
}

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error</h2>
          <p style={{ color: '#555' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '0.75rem 2rem', background: colors.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '1rem' }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }




  const whatsappNumber =
    institucion?.institucion_celular1 && institucion.institucion_celular1 !== 2147483647
      ? institucion.institucion_celular1
      : null;

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Contenido principal siempre renderizado */}
      <div style={{ 
        opacity: showLoading ? 0 : 1,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: showLoading ? 'none' : 'auto'
      }}>
        <Header data={institucion} />

      {/* ==================== HERO SECTION ==================== */}



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

          /* Botones sociales flotantes: reducidos en mobile para no tapar contenido */
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

          /* Texto justificado solo en pantallas medianas en adelante */
          .justify-desktop {
            text-align: left;
          }
          @media (min-width: 640px) {
            .justify-desktop {
              text-align: justify;
            }
          }
        `}</style>

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -2 }}>
          {contenido?.portada && contenido.portada.length > 0 ? (
            contenido.portada.map((portada, index) => (
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


{/* Esquina inferior derecha (original) */}
<img 
  src="/decoradores/esquina-derecha.png" 
  alt=""
  style={{
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 'clamp(350px, 100vw, 500px)',
    height: 'auto',
    pointerEvents: 'none',
    zIndex: 1,
  }}
/>

{/* Esquina inferior izquierda (invertida) */}
<img 
  src="/decoradores/esquina-derecha_invertido.png" 
  alt=""
  style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 'clamp(350px, 100vw, 500px)',
    height: 'auto',
    pointerEvents: 'none',
    zIndex: 1,
  }}
/>


{/* GIF animado decorativo */}
<img 
  src="/decoradores/decor_mov2.gif" 
  alt=""
  style={{
    position: 'absolute',

top: '56%',
left: '85%',

    transform: 'translateX(-50%)',

    width: 'clamp(120px, 20vw, 250px)',

    height: 'auto',
    pointerEvents: 'none',
    zIndex: 1,

    opacity: 0.85,
  }}
/>


{/* GIF animado decorativo */}
<img 
  src="/decoradores/decor_mov2.gif" 
  alt=""
  style={{
    position: 'absolute',

top: '35%',
left: '15%',

    transform: 'translateX(-50%)',

    width: 'clamp(120px, 20vw, 250px)',

    height: 'auto',
    pointerEvents: 'none',
    zIndex: 1,

    opacity: 0.85,
  }}
/>

<div style={{ 
  textAlign: 'center', 
  color: '#fff', 
  padding: 'clamp(0.5rem, 2vw, 1rem)', 
  maxWidth: 'clamp(320px, 92vw, 1100px)', 
  margin: '0 auto', 
  position: 'relative', 
  zIndex: 1,
}}>

  
  {/* Contenido dentro del marco */}
  <div style={{ 
    position: 'relative', 
    zIndex: 1, 
    padding: 'clamp(0.5rem, 2vw, 1.5rem)',
    animation: 'fadeInUp 1s ease-out',
  }}>          
          
          <div
            className="logo-pulse"
            style={{
              width: 'clamp(80px, 20vw, 130px)', height: 'clamp(80px, 20vw, 130px)', margin: '0 auto 1rem', background: '#fff', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              border: `5px solid ${colors.primary}`, animation: 'pulse 2s ease-in-out infinite', overflow: 'hidden',
            }}
          >
            {institucion?.institucion_logo ? (
              <img
                src={getImageUrl(institucion.institucion_logo)}
                alt="Logo Institucional"
                style={{ width: '85%', height: '85%', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, color: colors.primary }}>IGP</span>
            )}
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.8rem, 6vw, 3.5rem)', fontWeight: 900, color: '#FFD700', margin: '0 0 1rem',
              textShadow: '3px 3px 6px rgba(0,0,0,0.7)', letterSpacing: '2px', lineHeight: 1.2,
              textTransform: 'uppercase', minHeight: '1.2em',
            }}
          >
            <TypeAnimation
              sequence={[
                institucion?.institucion_nombre || 'INGENIERÍA DE GAS Y PETROQUÍMICA',
                800,
              ]}
              wrapper="span"
              speed={55}
              cursor={true}
              repeat={0}
            />
          </h1>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
            <a
              href="#sobre-nosotros"
              style={{
                padding: '1rem 2.5rem', background: colors.primary, color: '#fff', textDecoration: 'none',
                borderRadius: '50px', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease', display: 'inline-block',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)'; }}
            >
              Conocer Más
            </a>

            <a
              href="#contacto"
              style={{
                padding: '1rem 2.5rem', background: 'transparent', color: '#fff', textDecoration: 'none',
                borderRadius: '50px', fontWeight: 700, fontSize: '1.1rem', border: `3px solid ${colors.secondary}`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'all 0.3s ease', display: 'inline-block',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.secondary; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Contactar
            </a>
          </div>

          {contenido?.portada && contenido.portada.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>

              {contenido.portada.map((_, index) => (
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

      {/* ==================== EXPLORA NUESTRA INSTITUCIÓN ==================== */}
      <section
        id="explora-nuestra-institucion"
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) 0',
          background: `linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(ellipse at 20% 30%, ${colors.primary}90 0%, transparent 70%), radial-gradient(ellipse at 80% 70%, ${colors.secondary}90 0%, transparent 70%)`,
            pointerEvents: 'none', zIndex: 0,
          }}
        ></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#fff', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Explora Nuestra Institución
              </h2>
              <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, margin: '0 auto', borderRadius: '2px' }}></div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" style={{ marginBottom: '2rem' }}>
            {recursos?.linksExternoInterno
              ?.filter((link) => link.estado === 1)
              .map((link, index) => {
                const imageUrl = getImageUrl(link.imagen);
                const isEven = index % 2 === 0;
                const cardBg = isEven ? `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` : `linear-gradient(135deg, ${colors.secondary}20, ${colors.primary}20)`;
                const cardOverlay = isEven ? `linear-gradient(135deg, ${colors.primary}cc 0%, ${colors.secondary}cc 100%)` : `linear-gradient(135deg, ${colors.secondary}cc 0%, ${colors.primary}cc 100%)`;

                return (
                  <FadeIn key={link.id_link} delay={index * 0.08}>
                    <Tilt
                      tiltMaxAngleX={8}
                      tiltMaxAngleY={8}
                      perspective={1200}
                      scale={1.02}
                      transitionSpeed={1200}
                      glareEnable
                      glareMaxOpacity={0.15}
                      glareColor="#ffffff"
                      glarePosition="all"
                      style={{ height: '100%' }}
                    >
                      <a
                        href={link.url_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                        style={{
                          borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
                          cursor: 'pointer', position: 'relative', minHeight: 'clamp(280px, 40vw, 360px)', background: cardBg,
                          textDecoration: 'none', display: 'block', height: '100%',
                        }}
                      >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: cardOverlay, opacity: 0.85, zIndex: 0, overflow: 'hidden' }}>
                          {link.imagen && (
                            <img
                              src={imageUrl}
                              alt={link.nombre}
                              className="transition-transform duration-700 ease-out group-hover:scale-125"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
                            />
                          )}
                        </div>
                        <div style={{ position: 'relative', zIndex: 1, padding: '2.25rem 1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'clamp(280px, 40vw, 360px)', textAlign: 'center', color: '#fff' }}>
                          <div
                            className="transition-transform duration-500 group-hover:scale-110"
                            style={{
                              width: '80px', height: '80px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.2)',
                              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                            }}
                          >
                            {link.imagen ? (
                              <img src={imageUrl} alt={link.nombre} style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
                            ) : (
                              <FiLink size={32} />
                            )}
                          </div>
                          {link.tipo && (
                            <span style={{ padding: '0.35rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              {link.tipo}
                            </span>
                          )}
                          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', lineHeight: 1.3 }}>
                            {link.nombre}
                          </h3>
                          <span
                            className="transition-transform duration-300 group-hover:translate-x-1"
                            style={{
                              padding: '0.8rem 1.75rem', background: '#fff', color: isEven ? colors.primary : colors.secondary,
                              borderRadius: '50px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            }}
                          >
                            Acceder <FiExternalLink size={16} />
                          </span>
                        </div>
                      </a>
                    </Tilt>
                  </FadeIn>
                );
              })}
          </div>

          {!recursos?.linksExternoInterno?.length && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p>No hay enlaces disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== AUTORIDADES (fondo claro + formas decorativas) ==================== */}
      <section
        id="autoridades"
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) 0',
          background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 50%, #f8fafc 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Formas decorativas */}
        <div style={{ position: 'absolute', top: '-120px', left: '-120px', width: '340px', height: '340px', borderRadius: '50%', background: `${colors.primary}18`, filter: 'blur(10px)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-140px', right: '-100px', width: '380px', height: '380px', borderRadius: '50%', background: `${colors.secondary}18`, filter: 'blur(10px)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '35%', right: '8%', width: '90px', height: '90px', borderRadius: '24px', background: `${colors.primary}12`, transform: 'rotate(20deg)', zIndex: 0 }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#0f172a', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                Autoridades
              </h2>
              <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, margin: '0 auto', borderRadius: '2px' }}></div>
              <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '600px', margin: '1.5rem auto 0' }}>
                Conoce a las autoridades que lideran nuestra institución
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {autoridades.map((autoridad, index) => {
              const fotoUrl = getImageUrl(autoridad.foto_autoridad);
              const barColor = index % 3 === 1 ? colors.secondary : colors.primary;
              const hasFacebook = autoridad.facebook_autoridad && autoridad.facebook_autoridad !== 'qweqwe';
              const hasCelular = autoridad.celular_autoridad && autoridad.celular_autoridad !== '234';

              return (
                <FadeIn key={autoridad.id_autoridad} delay={index * 0.08}>
                  <div
                    className="group"
                    style={{
                      borderRadius: '18px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                      transition: 'box-shadow 0.35s ease, transform 0.35s ease', background: '#fff',
                      border: `1px solid ${barColor}25`, height: '100%',
                    }}
                  >
                    <div style={{ position: 'relative', height: 'clamp(260px, 45vw, 360px)', overflow: 'hidden', background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)` }}>
                      {fotoUrl ? (
                        <img
                          src={fotoUrl}
                          alt={autoridad.nombre_autoridad}
                          className="transition-transform duration-500 group-hover:scale-105"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` }}>
                          <FaUserTie size={72} color={barColor} opacity={0.35} />
                        </div>
                      )}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}></div>

                      {/* Redes sociales: emergen de abajo hacia arriba al hover */}
                      {(hasFacebook || hasCelular) && (
                        <div
                          className="translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: '0.85rem', justifyContent: 'center', padding: '1.1rem' }}
                        >
                          {hasFacebook && (
                            <a
                              href={`https://facebook.com/${autoridad.facebook_autoridad}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
                            >
                              <FaFacebookF size={17} color="#fff" />
                            </a>
                          )}
                          {hasCelular && (
                            <a
                              href={`https://wa.me/${autoridad.celular_autoridad}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
                            >
                              <FaWhatsapp size={19} color="#fff" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '1.75rem', textAlign: 'center' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.6rem', lineHeight: 1.3 }}>
                        {autoridad.nombre_autoridad}
                      </h3>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: barColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {autoridad.cargo_autoridad}
                      </p>
                    </div>
                    <div style={{ height: '4px', background: barColor }}></div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {!autoridades.length && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <p>No hay autoridades registradas en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== SOBRE NOSOTROS (fondo claro, card con sombra) ==================== */}
      <section
        id="sobre-nosotros"
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) 0',
          background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 50%, #ffffff 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '8%', right: '4%', color: colors.primary, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
          <FaIndustry size={280} />
        </div>
        <div style={{ position: 'absolute', bottom: '6%', left: '4%', color: colors.secondary, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
          <FaCogs size={200} />
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center">
            <FadeIn>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div
                  style={{
                    width: 'clamp(180px, 55vw, 320px)', height: 'clamp(180px, 55vw, 320px)', borderRadius: '50%', overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: `8px solid ${colors.primary}`, background: '#fff', position: 'relative',
                  }}
                >
                  {institucion?.institucion_logo ? (
                    <img
                      src={getImageUrl(institucion.institucion_logo)}
                      alt={institucion.institucion_nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`, fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, color: colors.primary }}>
                      IGP
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div>
                <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#0f172a', marginBottom: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Sobre Nosotros
                </h2>

                <div
                  style={{
                    background: '#fff', borderRadius: '20px', padding: '1.75rem 1.5rem',
                    boxShadow: '0 15px 45px rgba(15,23,42,0.08)', borderLeft: `5px solid ${colors.primary}`, marginBottom: '2rem',
                  }}
                >
                  <div
                    className="justify-desktop"
                    style={{ fontSize: '1.02rem', color: '#334155', lineHeight: '1.9' }}
                    dangerouslySetInnerHTML={{
                      __html:
                        institucion?.institucion_historia ||
                        'La Carrera de Ingeniería de Gas y Petroquímica de la Universidad Pública de El Alto (UPEA) ha sido un pilar en la formación de profesionales competentes para el desarrollo del país.',
                    }}
                  />
                </div>

                <a
                  href="#contacto"
                  style={{
                    display: 'inline-block', padding: '1rem 2.5rem', background: colors.primary, color: '#fff',
                    textDecoration: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '1rem',
                    boxShadow: `0 8px 25px ${colors.primary}40`, transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Contáctanos →
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ==================== PUBLICACIONES (carrusel automático, 3 a la vez) ==================== */}
      <section
        id="publicaciones"
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) 0',
          background: `linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(ellipse at 20% 30%, ${colors.secondary}90 0%, transparent 70%), radial-gradient(ellipse at 80% 70%, ${colors.primary}90 0%, transparent 70%)`,
            pointerEvents: 'none', zIndex: 0,
          }}
        ></div>

        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', color: '#fff', marginBottom: '1rem', fontWeight: 800 }}>
                Noticias y Publicaciones
              </h2>
              <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, margin: '0 auto 1rem', borderRadius: '2px' }}></div>
              <p style={{ fontSize: '1.05rem', color: '#cbd5e1' }}>Mantente informado sobre las últimas novedades</p>
            </div>
          </FadeIn>

          {publicacionesOrdenadas.length > 0 ? (
            <FadeIn delay={0.1}>
              <style>{`
                .publicaciones-swiper .swiper-pagination-bullet { background: #fff; opacity: 0.4; }
                .publicaciones-swiper .swiper-pagination-bullet-active { opacity: 1; background: ${colors.primary}; }
              `}</style>
              <Swiper
                className="publicaciones-swiper"
                modules={[Autoplay, Pagination]}
                spaceBetween={28}
                slidesPerView={1}
                loop={publicacionesOrdenadas.length > 3}
                autoplay={{ delay: 3200, disableOnInteraction: false, reverseDirection: true, pauseOnMouseEnter: true }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                style={{ paddingBottom: '3.5rem' }}
              >
                {publicacionesOrdenadas.map((pub) => {
                  const imgUrl = getImageUrl(pub.publicaciones_imagen);
                  const fecha = pub.publicaciones_fecha
                    ? new Date(pub.publicaciones_fecha).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '';
                  const descarga = pub.publicaciones_documento || pub.publicaciones_imagen;

                  return (
                    <SwiperSlide key={pub.publicaciones_id} style={{ height: 'auto' }}>
                      <div
                        style={{
                          background: '#fff', borderRadius: '18px', overflow: 'hidden', height: '100%',
                          display: 'flex', flexDirection: 'column', boxShadow: '0 10px 35px rgba(0,0,0,0.2)',
                        }}
                      >
                        <div style={{ padding: '1.5rem 1.5rem 1.1rem', background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`, color: '#fff' }}>
                          <span style={{ display: 'inline-block', padding: '0.3rem 0.9rem', background: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', borderRadius: '50px', marginBottom: '0.85rem' }}>
                            {pub.publicaciones_tipo || 'PUBLICACIÓN'}
                          </span>
                          <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#FFD700', fontWeight: 700, margin: '0 0 0.5rem' }}>
                            <FaRegCalendarAlt size={13} /> {fecha}
                          </p>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, lineHeight: 1.3, minHeight: '2.6em' }}>
                            {pub.publicaciones_titulo}
                          </h3>
                        </div>

                        <div style={{ position: 'relative', height: '190px', background: '#f1f5f9', overflow: 'hidden' }}>
                          {imgUrl ? (
                            <img src={imgUrl} alt={pub.publicaciones_titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FaNewspaper size={48} color={colors.primary} opacity={0.3} />
                            </div>
                          )}
                        </div>

                        <div style={{ padding: '1.4rem 1.5rem 1.6rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.65, margin: '0 0 1.25rem', flex: 1 }}>
                            {stripHtml(pub.publicaciones_descripcion).substring(0, 130) || 'Publicación disponible para su consulta.'}
                            {stripHtml(pub.publicaciones_descripcion).length > 130 ? '…' : ''}
                          </p>
                          {descarga && (
                            <a
                              href={descarga}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                padding: '0.75rem 1.25rem', background: `${colors.primary}12`, color: colors.primary,
                                textDecoration: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.3s ease',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = colors.primary; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = `${colors.primary}12`; e.currentTarget.style.color = colors.primary; }}
                            >
                              <FiDownload size={16} /> Descargar
                            </a>
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </FadeIn>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
              <FaNewspaper size={56} color="#64748b" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>No hay publicaciones disponibles</h3>
              <p style={{ color: '#94a3b8' }}>Pronto publicaremos nuevas noticias y actualizaciones.</p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== VIDEOS INSTITUCIONALES (carrusel automático, 3 a la vez) ==================== */}
      <section
        id="videos"
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) 0',
          background: `linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(ellipse at 20% 30%, ${colors.primary}90 0%, transparent 70%), radial-gradient(ellipse at 80% 70%, ${colors.secondary}90 0%, transparent 70%)`,
            pointerEvents: 'none', zIndex: 0,
          }}
        ></div>

        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#fff', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Videos Institucionales
              </h2>
              <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, margin: '0 auto 1.5rem', borderRadius: '2px' }}></div>
              <p style={{ fontSize: '1.05rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
                Conoce más sobre nuestra institución a través de nuestros videos
              </p>
            </div>
          </FadeIn>

          {videos.length > 0 ? (
            <FadeIn delay={0.1}>
              <style>{`
                .videos-swiper .swiper-pagination-bullet { background: #fff; opacity: 0.4; }
                .videos-swiper .swiper-pagination-bullet-active { opacity: 1; background: ${colors.secondary}; }
              `}</style>
              <Swiper
                className="videos-swiper"
                modules={[Autoplay, Pagination]}
                spaceBetween={28}
                slidesPerView={1}
                loop={videos.length > 3}
                autoplay={{ delay: 3600, disableOnInteraction: false, reverseDirection: true, pauseOnMouseEnter: true }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                style={{ paddingBottom: '3.5rem' }}
              >
                {videos.map((video, index) => {
                  const accent = index % 2 === 0 ? colors.primary : colors.secondary;
                  return (
                    <SwiperSlide key={video.video_id} style={{ height: 'auto' }}>
                      <div
                        style={{
                          background: '#fff', borderRadius: '16px', overflow: 'hidden', height: '100%',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.25)', border: `2px solid ${accent}20`,
                          display: 'flex', flexDirection: 'column',
                        }}
                      >
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#000' }}>
                          <iframe
                            src={video.video_enlace}
                            title={video.video_titulo}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <span style={{ display: 'inline-block', padding: '0.3rem 0.9rem', background: `${accent}15`, color: accent, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', borderRadius: '50px', marginBottom: '0.85rem', width: 'fit-content' }}>
                            {video.video_tipo || 'VIDEO'}
                          </span>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.6rem', lineHeight: 1.3 }}>
                            {video.video_titulo}
                          </h4>
                          <div
                            style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}
                            dangerouslySetInnerHTML={{ __html: video.video_breve_descripcion || '' }}
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </FadeIn>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
              <FaVideo size={56} color="#64748b" style={{ marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 700 }}>No hay videos disponibles</h3>
              <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
                Pronto publicaremos videos sobre las actividades de nuestra institución.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== CONTACTO (rediseño total, sin formulario) ==================== */}
      <section
        id="contacto"
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) 0',
          background: `linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(ellipse at 20% 20%, ${colors.primary}90 0%, transparent 70%), radial-gradient(ellipse at 80% 80%, ${colors.secondary}90 0%, transparent 70%)`,
            pointerEvents: 'none', zIndex: 0,
          }}
        ></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: `${colors.primary}20`, color: '#fff', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Contáctanos
              </span>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#fff', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                ¿Listo para comenzar?
              </h2>
              <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, margin: '0 auto 1.5rem', borderRadius: '2px' }}></div>
              <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
                Estamos aquí para resolver tus dudas. Encuentra toda nuestra información de contacto a continuación.
              </p>
            </div>
          </FadeIn>

          {/* Cards individuales de contacto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '3.5rem' }}>
            {[
              institucion?.institucion_direccion
                ? { icon: <FiMapPin size={26} />, label: 'Dirección', value: institucion.institucion_direccion, href: undefined }
                : null,
              whatsappNumber
                ? { icon: <FiPhone size={26} />, label: 'Teléfono', value: String(whatsappNumber), href: `tel:${whatsappNumber}` }
                : null,
              institucion?.institucion_correo1
                ? { icon: <FiMail size={26} />, label: 'Correo', value: institucion.institucion_correo1, href: `mailto:${institucion.institucion_correo1}` }
                : null,
              { icon: <FiClock size={26} />, label: 'Horario', value: 'Lun a Vie: 8:00–12:00 y 14:00–18:00', href: undefined },
            ]
              .filter((item): item is { icon: ReactElement; label: string; value: string; href: string | undefined } => item !== null)
              .map((item, index) => {
                const accent = index % 2 === 0 ? colors.primary : colors.secondary;
                const CardInner = (
                  <div
                    style={{
                      background: '#fff', borderRadius: '18px', padding: '2rem 1.5rem', height: '100%',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
                    }}
                  >
                    <div
                      style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${accent}20, ${accent}10)`, color: accent,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                        {item.label}
                      </strong>
                      <p style={{ margin: 0, color: '#1e293b', fontSize: '0.98rem', lineHeight: 1.5, fontWeight: 600 }}>{item.value}</p>
                    </div>
                  </div>
                );

                return (
                  <FadeIn key={item.label} delay={index * 0.08}>
                    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.03} transitionSpeed={1000} style={{ height: '100%' }}>
                      {item.href ? (
                        <a href={item.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                          {CardInner}
                        </a>
                      ) : (
                        CardInner
                      )}
                    </Tilt>
                  </FadeIn>
                );
              })}
          </div>

          {/* Redes sociales */}
          <FadeIn delay={0.25}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '1.25rem' }}>Síguenos en nuestras redes sociales</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {institucion?.institucion_facebook && (
                  <a
                    href={institucion.institucion_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(24,119,242,0.35)', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <FaFacebookF size={20} color="#fff" />
                  </a>
                )}
                {institucion?.institucion_youtube && (
                  <a
                    href={institucion.institucion_youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(255,0,0,0.35)', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <FaYoutube size={22} color="#fff" />
                  </a>
                )}
                {institucion?.institucion_twitter && (
                  <a
                    href={institucion.institucion_twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.35)', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <FaXTwitter size={19} color="#fff" />
                  </a>
                )}
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(37,211,102,0.35)', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <FaWhatsapp size={24} color="#fff" />
                  </a>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
        <Footer data={institucion} />
      </div>

      {/* Loading Screen como overlay */}
      {showLoading && (
        <LoadingScreen
          institucion={institucion}
          text="Cargando"
          duration={2000}
          targetPageReady={contentReady}
          onFinish={() => setShowLoading(false)}
          gearPosition={{ bottom: '1%', right: '10%' }}
          tubeSize={200}
          gearSize={60}
        />
      )}
    </div>
  );
}

export default App;