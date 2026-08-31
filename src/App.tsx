import { useState, useEffect, useMemo, type ReactNode, type ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';
import { TypeAnimation } from 'react-type-animation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';



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

// Altura fija de card: la clave para que todas midan lo mismo.
const CARD_HEIGHT = 430;
const IMAGE_HEIGHT = 210;

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
const [minLoadingTime, setMinLoadingTime] = useState(false);
const [selectedImage, setSelectedImage] = useState('');

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

  // Cerrar modal con Escape y bloquear scroll
  useEffect(() => {
    if (!selectedImage) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedImage(''); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  // Tiempo mínimo del loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTime(true);
    }, 2000); // 5 segundos mínimo
    
    return () => clearTimeout(timer);
  }, []);

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



  if (loading || !minLoadingTime) {
    return (
      <LoadingScreen
        institucion={institucion}
        text="Cargando"
        duration={2000}
        onFinish={() => {}}
        tubeSize={280}
        gearSize={80}
        gearPosition={{ bottom: '-5%', right: '25%' }}
      />
    );
  }
  const whatsappNumber =
    institucion?.institucion_celular1 && institucion.institucion_celular1 !== 2147483647
      ? institucion.institucion_celular1
      : null;

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh',
    }}>
        <Header data={institucion} />
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

                            width: 'clamp(120px, 28vw, 200px)', height: 'clamp(120px, 28vw, 200px)', margin: '0 auto 1.5rem', background: '#fff', borderRadius: '50%',

              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              border: `5px solid ${colors.primary}`, animation: 'pulse 2s ease-in-out infinite', overflow: 'hidden',
            }}
          >
            {institucion?.institucion_logo ? (
              <img
                src={getImageUrl(institucion.institucion_logo)}
                alt="Logo Institucional"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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
          padding: 'clamp(4rem, 10vw, 8rem) 0',
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

        {/* DECORADORES ESTÁTICOS */}
        {/* Cometa - Esquina superior izquierda */}
        <motion.img
          src="/decoradores/decor_static/cometa.png"
          alt=""
          initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            position: 'absolute',
            top: '5%',
            left: '3%',
            width: 'clamp(60px, 8vw, 100px)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.6,
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))',
          }}
        />

        {/* Círculo azul - Esquina superior derecha */}
        <motion.img
          src="/decoradores/decor_static/circulo_azuul.png"
          alt=""
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.5 },
            scale: { duration: 0.6, delay: 0.5 },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
          }}
          style={{
            position: 'absolute',
            top: '8%',
            right: '5%',
            width: 'clamp(80px, 10vw, 140px)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.5,
          }}
        />

        {/* Redondo con forma - Lateral izquierdo */}
        <motion.img
          src="/decoradores/decor_static/redondo_con_forma.png"
          alt=""
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0, rotate: -360 }}
          transition={{ 
            opacity: { duration: 0.7, delay: 0.4 },
            x: { duration: 0.7, delay: 0.4 },
            rotate: { duration: 25, repeat: Infinity, ease: 'linear' }
          }}
          style={{
            position: 'absolute',
            top: '40%',
            left: '1%',
            width: 'clamp(100px, 12vw, 180px)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.4,
          }}
        />

        {/* Redondo form2 - Lateral derecho */}
        <motion.img
          src="/decoradores/decor_static/redondo_form2.png"
          alt=""
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0, rotate: 360 }}
          transition={{ 
            opacity: { duration: 0.7, delay: 0.6 },
            x: { duration: 0.7, delay: 0.6 },
            rotate: { duration: 22, repeat: Infinity, ease: 'linear' }
          }}
          style={{
            position: 'absolute',
            top: '35%',
            right: '2%',
            width: 'clamp(90px, 10vw, 160px)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.4,
          }}
        />

        {/* Decoración 1 - Abajo izquierda */}
        <motion.img
          src="/decoradores/decor_static/decoracion1.png"
          alt=""
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '5%',
            width: 'clamp(70px, 9vw, 120px)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.45,
          }}
        />

        {/* Decoración 2 - Abajo derecha */}
        <motion.img
          src="/decoradores/decor_static/decoracion2.png"
          alt=""
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{
            position: 'absolute',
            bottom: '3%',
            right: '4%',
            width: 'clamp(60px, 8vw, 100px)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.45,
          }}
        />

        {/* Líneas siksak - Decoración central */}
        <motion.img
          src="/decoradores/decor_static/3_lineas_siksak.png"
          alt=""
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(80px, 10vw, 150px)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.15,
          }}
        />

        {/* Redondo puteado - Centro izquierda */}
        <motion.img
          src="/decoradores/decor_static/redondo_puteado.png"
          alt=""
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ 
            opacity: { duration: 0.8, delay: 1 },
            rotate: { duration: 18, repeat: Infinity, ease: 'linear' }
          }}
          style={{
            position: 'absolute',
            top: '90%',
            left: '50%',
            width: 'clamp(70px, 8vw, 120px)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.35,
          }}
        />

        {/* Figura extraña - Centro derecha */}
        <motion.img
          src="/decoradores/decor_static/fihura_extraña1.png"
          alt=""
          initial={{ opacity: 0, rotate: 90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          style={{
            position: 'absolute',
            top: '65%',
            right: '8%',
            width: 'clamp(40px, 5vw, 70px)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.35,
          }}
        />

        {/* Raya tipo M - Decoración inferior */}
        <motion.img
          src="/decoradores/decor_static/raya_tipo_mm_negra.png"
          alt=""
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'clamp(100px, 15vw, 200px)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.2,
          }}
        />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
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
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{ height: '100%' }}
                    >
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
                            transition: 'box-shadow 0.3s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.25)'; }}
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

                          {/* Línea de acento superior */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: `linear-gradient(90deg, ${isEven ? colors.primary : colors.secondary}, transparent)`,
                            zIndex: 1,
                            opacity: 0.8,
                          }}></div>

                          <div style={{ position: 'relative', zIndex: 1, padding: '2.25rem 1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'clamp(280px, 40vw, 360px)', textAlign: 'center', color: '#fff' }}>
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.8, ease: 'easeInOut' }}
                              className="transition-transform duration-500 group-hover:scale-110"
                              style={{
                                width: '80px', height: '80px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                                border: '2px solid rgba(255,255,255,0.3)',
                              }}
                            >
                              {link.imagen ? (
                                <img src={imageUrl} alt={link.nombre} style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
                              ) : (
                                <FiLink size={32} />
                              )}
                            </motion.div>
                            {link.tipo && (
                              <span style={{ padding: '0.35rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', backdropFilter: 'blur(5px)' }}>
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
                                transition: 'all 0.3s ease',
                                marginTop: 'auto',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                              Acceder <FiExternalLink size={16} />
                            </span>
                          </div>
                        </a>
                      </Tilt>
                    </motion.div>
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
  {/* Formas decorativas base */}
  <div style={{ position: 'absolute', top: '-120px', left: '-120px', width: 'clamp(200px, 30vw, 340px)', height: 'clamp(200px, 30vw, 340px)', borderRadius: '50%', background: `${colors.primary}18`, filter: 'blur(10px)', zIndex: 0 }}></div>
  <div style={{ position: 'absolute', bottom: '-140px', right: '-100px', width: 'clamp(220px, 32vw, 380px)', height: 'clamp(220px, 32vw, 380px)', borderRadius: '50%', background: `${colors.secondary}18`, filter: 'blur(10px)', zIndex: 0 }}></div>

  {/* ============ DECORADORES ESTÁTICOS ANIMADOS + GRID RESPONSIVO ============ */}
  <style>{`
    .decorador-autoridad {
      position: absolute;
      pointer-events: none;
      z-index: 1;
    }
    @media (max-width: 768px) {
      .decorador-autoridad { opacity: 0.25 !important; }
      .decorador-hide-mobile { display: none; }
    }
    @media (max-width: 480px) {
      .decorador-autoridad { opacity: 0.15 !important; }
    }

    /* --- Grid de autoridades: reemplaza las clases de Tailwind por CSS real --- */
    .autoridades-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 640px) {
      .autoridades-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
      }
    }
    @media (min-width: 1024px) {
      .autoridades-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
      }
    }

    /* --- Barra de redes sociales: visible siempre en táctil (no hay hover) --- */
    @media (hover: none) {
      .autoridad-social-bar {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    }
  `}</style>

  {/* Círculo - Superior izquierda - GIRANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/circulo.png"
    alt=""
    className="decorador-autoridad"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.5, scale: 1, rotate: 360 }}
    transition={{
      opacity: { duration: 0.8, delay: 0.3 },
      scale: { duration: 0.8, delay: 0.3 },
      rotate: { duration: 25, repeat: Infinity, ease: 'linear' }
    }}
    style={{ top: '5%', left: '2%', width: 'clamp(40px, 6vw, 100px)', height: 'auto' }}
  />

  {/* Tuerca - Esquina superior derecha - GIRANDO - Solo mitad visible */}
  <motion.div
    className="decorador-autoridad"
    style={{ position: 'absolute', top: '-15%', right: '-10%', width: 'clamp(250px, 35vw, 600px)', height: 'auto', zIndex: 1 }}
  >
    <motion.img
      src="/decoradores/decor_static/tuerca_2.png"
      alt=""
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 0.7, rotate: 360 }}
      transition={{ opacity: { duration: 0.8, delay: 0.3 }, rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
      style={{ width: '100%', height: 'auto', filter: `drop-shadow(0 0 20px ${colors.primary}40)` }}
    />
  </motion.div>

  {/* Tuerca - Esquina inferior izquierda - GIRANDO inverso - Solo mitad visible */}
  <motion.div
    className="decorador-autoridad"
    style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: 'clamp(250px, 35vw, 600px)', height: 'auto', zIndex: 1 }}
  >
    <motion.img
      src="/decoradores/decor_static/tuerca_2.png"
      alt=""
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 0.7, rotate: -360 }}
      transition={{ opacity: { duration: 0.8, delay: 0.5 }, rotate: { duration: 22, repeat: Infinity, ease: 'linear' } }}
      style={{ width: '100%', height: 'auto', filter: `drop-shadow(0 0 20px ${colors.secondary}40)` }}
    />
  </motion.div>

  {/* Redondo puteado - Centro - GIRANDO */}
  <motion.img
    src="/decoradores/decor_static/redondo_puteado.png"
    alt=""
    className="decorador-autoridad decorador-hide-mobile"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.4, scale: 1, rotate: 360 }}
    transition={{ opacity: { duration: 0.8, delay: 0.7 }, scale: { duration: 0.8, delay: 0.7 }, rotate: { duration: 22, repeat: Infinity, ease: 'linear' } }}
    style={{ top: '50%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(40px, 5vw, 90px)', height: 'auto' }}
  />

  {/* Cuadrado punteado rojo - Superior derecha - FLOTANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/cuadrado_punteado_rojo.png"
    alt=""
    className="decorador-autoridad decorador-hide-mobile"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.4, y: [0, -15, 0] }}
    transition={{ opacity: { duration: 0.8, delay: 0.5 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
    style={{ top: '4%', right: '3%', width: 'clamp(35px, 5vw, 80px)', height: 'auto' }}
  />

  {/* Objeto - Lateral izquierdo - FLOTANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/objeto.png"
    alt=""
    className="decorador-autoridad decorador-hide-mobile"
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 0.45, x: 0, y: [0, -12, 0] }}
    transition={{ opacity: { duration: 0.8, delay: 0.7 }, x: { duration: 0.8, delay: 0.7 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
    style={{ top: '30%', left: '1%', width: 'clamp(35px, 5vw, 80px)', height: 'auto' }}
  />

  {/* Objeto combinado - Lateral derecho - FLOTANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/objeto_combinado.png"
    alt=""
    className="decorador-autoridad decorador-hide-mobile"
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 0.45, x: 0, y: [0, -14, 0] }}
    transition={{ opacity: { duration: 0.8, delay: 0.8 }, x: { duration: 0.8, delay: 0.8 }, y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }}
    style={{ top: '25%', right: '1%', width: 'clamp(35px, 5vw, 85px)', height: 'auto' }}
  />

  {/* Redondo punteado rojo - Centro izquierda - GIRANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/redondo_puntedo_rojo.png"
    alt=""
    className="decorador-autoridad"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.5, scale: 1, rotate: -360 }}
    transition={{ opacity: { duration: 0.8, delay: 0.6 }, scale: { duration: 0.8, delay: 0.6 }, rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
    style={{ top: '45%', left: '3%', width: 'clamp(50px, 7vw, 120px)', height: 'auto' }}
  />

  {/* Redondo punteado 5 - Centro derecha - GIRANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/redondo_punteuado5.png"
    alt=""
    className="decorador-autoridad decorador-hide-mobile"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.45, scale: 1, rotate: 360 }}
    transition={{ opacity: { duration: 0.8, delay: 0.7 }, scale: { duration: 0.8, delay: 0.7 }, rotate: { duration: 28, repeat: Infinity, ease: 'linear' } }}
    style={{ top: '50%', right: '2%', width: 'clamp(45px, 6vw, 110px)', height: 'auto' }}
  />

  {/* Rectángulo punteado - Abajo izquierda - FLOTANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/rectangulo punteado.png"
    alt=""
    className="decorador-autoridad"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 0.4, y: [0, -10, 0] }}
    transition={{ opacity: { duration: 0.8, delay: 0.9 }, y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } }}
    style={{ bottom: '3%', left: '5%', width: 'clamp(40px, 6vw, 100px)', height: 'auto' }}
  />

  {/* Shape 35 - Abajo derecha - FLOTANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/shape-35.png"
    alt=""
    className="decorador-autoridad decorador-hide-mobile"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 0.45, y: [0, -12, 0] }}
    transition={{ opacity: { duration: 0.8, delay: 1 }, y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' } }}
    style={{ bottom: '5%', right: '3%', width: 'clamp(35px, 5vw, 90px)', height: 'auto' }}
  />

  {/* Círculo línea - Centro - GIRANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/decoradores2/circulo_linea_.png"
    alt=""
    className="decorador-autoridad decorador-hide-mobile"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.35, scale: 1, rotate: 360 }}
    transition={{ opacity: { duration: 0.8, delay: 0.4 }, scale: { duration: 0.8, delay: 0.4 }, rotate: { duration: 30, repeat: Infinity, ease: 'linear' } }}
    style={{ top: '35%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(50px, 7vw, 130px)', height: 'auto' }}
  />

  {/* Línea sicsac amarillo - Abajo centro - FLOTANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/decoradores3/linea_sicsac_amariillo.png"
    alt=""
    className="decorador-autoridad"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 0.35, y: [0, -8, 0] }}
    transition={{ opacity: { duration: 0.8, delay: 1.1 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
    style={{ bottom: '2%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(80px, 12vw, 180px)', height: 'auto' }}
  />

  {/* Cuadrado punteado (decoradores2) - FLOTANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/decoradores2/cuadrado_puntueado.png"
    alt=""
    className="decorador-autoridad decorador-hide-mobile"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 0.4, x: 0, y: [0, -10, 0] }}
    transition={{ opacity: { duration: 0.8, delay: 0.8 }, x: { duration: 0.8, delay: 0.8 }, y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' } }}
    style={{ top: '55%', left: '2%', width: 'clamp(30px, 4vw, 70px)', height: 'auto' }}
  />

  {/* Objeto punteado - FLOTANDO */}
  <motion.img
    src="/Decoradores_gas_petroqumica/decoradoresestaticos/decoradores2/objeto_puntueado.png"
    alt=""
    className="decorador-autoridad decorador-hide-mobile"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 0.4, x: 0, y: [0, -12, 0] }}
    transition={{ opacity: { duration: 0.8, delay: 0.9 }, x: { duration: 0.8, delay: 0.9 }, y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' } }}
    style={{ top: '60%', right: '2%', width: 'clamp(35px, 5vw, 80px)', height: 'auto' }}
  />

  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
    <FadeIn>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
        <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#0f172a', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
          Autoridades
        </h2>
        <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, margin: '0 auto', borderRadius: '2px' }}></div>
        <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: '#475569', maxWidth: '600px', margin: '1.5rem auto 0', padding: '0 1rem' }}>
          Conoce a las autoridades que lideran nuestra institución
        </p>
      </div>
    </FadeIn>

    {/* antes: className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" (Tailwind) */}
    <div className="autoridades-grid">
      {autoridades.map((autoridad, index) => {
        const fotoUrl = getImageUrl(autoridad.foto_autoridad);
        const barColor = index % 3 === 1 ? colors.secondary : colors.primary;
        const hasFacebook = autoridad.facebook_autoridad && autoridad.facebook_autoridad !== 'qweqwe';
        const hasCelular = autoridad.celular_autoridad && autoridad.celular_autoridad !== '234';

        return (
          <FadeIn key={autoridad.id_autoridad} delay={index * 0.08}>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.5,
                rotate: index % 2 === 0 ? -8 : 8,
                x: index % 3 === 0 ? -60 : index % 3 === 1 ? 0 : 60,
                y: 40,
              }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.1 }}
              whileHover="hover"
              style={{ height: '100%' }}
            >
              <motion.div
                variants={{ hover: { scale: 1.03, rotate: index % 2 === 0 ? -2 : 2, transition: { duration: 0.3, ease: 'easeOut' } } }}
                style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                  background: '#fff',
                  border: `2px solid ${barColor}30`,
                  height: '100%',
                  position: 'relative',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <motion.div
                  variants={{ hover: { y: -4, transition: { duration: 0.2 } } }}
                  style={{ position: 'relative', height: 'clamp(220px, 35vw, 360px)', overflow: 'hidden', background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)` }}
                >
                  {fotoUrl ? (
                    <motion.img
                      src={fotoUrl}
                      alt={autoridad.nombre_autoridad}
                      variants={{ hover: { scale: 1.1, transition: { duration: 0.5 } } }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` }}>
                      <FaUserTie size={72} color={barColor} opacity={0.35} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}></div>

                  {(hasFacebook || hasCelular) && (
                    <motion.div
                      className="autoridad-social-bar"
                      initial={{ y: '100%', opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
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
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  variants={{ hover: { y: -2, transition: { duration: 0.2 } } }}
                  style={{ padding: 'clamp(1rem, 3vw, 1.75rem)', textAlign: 'center', background: '#fff' }}
                >
                  <h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, color: '#1e293b', margin: '0 0 0.6rem', lineHeight: 1.3 }}>
                    {autoridad.nombre_autoridad}
                  </h3>
                  <p style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', fontWeight: 600, color: barColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {autoridad.cargo_autoridad}
                  </p>
                </motion.div>

                <motion.div
                  variants={{ hover: { scaleX: 1.05, transition: { duration: 0.3 } } }}
                  style={{ height: '4px', background: barColor }}
                />
              </motion.div>
            </motion.div>
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
        {/* Fondo complejo petrolero al pie de la sección - RECORRIDO MEDIO CENTÍMETRO ABAJO */}
        <div style={{
          position: 'absolute',
          bottom: '-13px', // ← Recorrido medio centímetro abajo
          left: 0,
          right: 0,
          height: 'clamp(150px, 25vw, 300px)',
          background: `url('/Decoradores_gas_petroqumica/fondo_complejo_petrolero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          opacity: 0.80,
          pointerEvents: 'none',
          zIndex: 0,
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
        }}></div>

        {/* Iconos decorativos de fondo */}
        <div style={{ position: 'absolute', top: '8%', right: '4%', color: colors.primary, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
          <FaIndustry size={280} />
        </div>
        <div style={{ position: 'absolute', bottom: '6%', left: '4%', color: colors.secondary, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
          <FaCogs size={200} />
        </div>

        {/* ============ DECORADORES ANIMADOS (máximo 4) ============ */}
        
        {/* 1. Petroleria GIF - Lateral derecho */}
        <motion.img
          src="/Decoradores_gas_petroqumica/decaradores_animado/petroleria.gif"
          alt=""
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.3, x: 0, y: [0, -15, 0] }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.3 },
            x: { duration: 0.8, delay: 0.3 },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
          }}
          style={{
            position: 'absolute',
            top: '10%',
            right: '-2%',
            width: 'clamp(120px, 18vw, 300px)',
            height: 'auto',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* 3. Decor mov - Esquina superior izquierda */}
        <motion.img
          src="/Decoradores_gas_petroqumica/decaradores_animado/decor_mov.gif"
          alt=""
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 0.35, y: [0, -10, 0] }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.7 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
          style={{
            position: 'absolute',
            top: '3%',
            left: '3%',
            width: 'clamp(50px, 7vw, 120px)',
            height: 'auto',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* 4. Tuerca girando - Abajo derecha */}
        <motion.img
          src="/Decoradores_gas_petroqumica/decaradores_animado/tuerca_girando.gif"
          alt=""
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.9 },
            scale: { duration: 0.8, delay: 0.9 },
          }}
          style={{
            position: 'absolute',
            bottom: '5%',
            right: '5%',
            width: 'clamp(50px, 6vw, 100px)',
            height: 'auto',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center">
            <FadeIn>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Logo con flotación y giro 3D */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{
                    perspective: '1000px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ 
                      y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                    }}
                    whileHover={{ rotateY: 360 }}
                    transition-hover={{ duration: 1.5, ease: 'easeInOut' }}
                    style={{
                      width: 'clamp(220px, 60vw, 380px)', // ← Logo más grande
                      height: 'clamp(220px, 60vw, 380px)', // ← Logo más grande
                      borderRadius: '50%',
                      overflow: 'hidden',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                      border: `8px solid ${colors.primary}`,
                      background: '#fff',
                      position: 'relative',
                      transformStyle: 'preserve-3d',
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

                    {/* Anillo decorativo girando */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '-8px',
                        right: '-8px',
                        bottom: '-8px',
                        borderRadius: '50%',
                        border: `2px dashed ${colors.secondary}40`,
                        pointerEvents: 'none',
                      }}
                    ></motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div>
                <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#0f172a', marginBottom: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Sobre Nosotros
                </h2>

                {/* Card de historia con máquina de escribir */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: 'clamp(1.5rem, 3vw, 2rem)',
                    boxShadow: '0 15px 45px rgba(15,23,42,0.08)',
                    borderLeft: `5px solid ${colors.primary}`,
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decoración esquina superior derecha */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `${colors.secondary}15`,
                    pointerEvents: 'none',
                  }}></div>
                  
                  {/* Decoración esquina inferior izquierda */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-15px',
                    left: '-15px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `${colors.primary}10`,
                    pointerEvents: 'none',
                  }}></div>

                  {/* Máquina de escribir */}
                  <TypeAnimation
                    sequence={[
                      institucion?.institucion_historia || 'La Carrera de Ingeniería de Gas y Petroquímica de la Universidad Pública de El Alto (UPEA) ha sido un pilar en la formación de profesionales competentes para el desarrollo del país.',
                      1000,
                    ]}
                    wrapper="div"
                    speed={90}
                    cursor={true}
                    repeat={0}
                    className="justify-desktop"
                    style={{ 
                      fontSize: 'clamp(0.9rem, 2vw, 1.02rem)', 
                      color: '#334155', 
                      lineHeight: '1.9',
                    }}
                  />
                </motion.div>

                <motion.a
                  href="#contacto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'inline-block', padding: '1rem 2.5rem', background: colors.primary, color: '#fff',
                    textDecoration: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '1rem',
                    boxShadow: `0 8px 25px ${colors.primary}40`, transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Contáctanos →
                </motion.a>
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

  {/* ============ DECORADORES ESTÁTICOS ANIMADOS ============ */}
  <style>{`
    .decorador-publicacion {
      position: absolute;
      pointer-events: none;
      z-index: 1;
    }
    @media (max-width: 768px) {
      .decorador-publicacion { opacity: 0.18 !important; }
      .decorador-hide-mobile { display: none; }
    }

    .publicaciones-swiper .swiper-pagination-bullet { background: #fff; opacity: 0.4; }
    .publicaciones-swiper .swiper-pagination-bullet-active { opacity: 1; background: ${colors.primary}; }

    .publicaciones-swiper .swiper-button-next,
    .publicaciones-swiper .swiper-button-prev {
      color: ${colors.primary} !important;
      background: rgba(255,255,255,0.1);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      margin-top: -28px;
    }
    .publicaciones-swiper .swiper-button-next:hover,
    .publicaciones-swiper .swiper-button-prev:hover {
      background: ${colors.primary};
      color: #fff !important;
      transform: scale(1.1);
    }
    .publicaciones-swiper .swiper-button-next::after,
    .publicaciones-swiper .swiper-button-prev::after {
      font-size: 1.15rem !important;
      font-weight: 900;
    }
    .publicaciones-nav-prev { left: -10px; }
    .publicaciones-nav-next { right: -10px; }

    @media (max-width: 900px) {
      .publicaciones-nav-prev { left: 4px; }
      .publicaciones-nav-next { right: 4px; }
      .publicaciones-swiper .swiper-button-next,
      .publicaciones-swiper .swiper-button-prev {
        width: 38px;
        height: 38px;
      }
      .publicaciones-swiper .swiper-button-next::after,
      .publicaciones-swiper .swiper-button-prev::after {
        font-size: 0.95rem !important;
      }
    }
  `}</style>

  {/* Tuerca - Esquina superior derecha */}
  <motion.img
    src="/decoradores/decor_static/tuerca_2.png"
    alt=""
    className="decorador-publicacion"
    initial={{ opacity: 0, rotate: 0 }}
    animate={{ opacity: 0.5, rotate: 360 }}
    transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
    style={{ top: '-5%', right: '-5%', width: 'clamp(100px, 15vw, 250px)', height: 'auto' }}
  />

  {/* Círculo azul - Superior izquierda */}
  <motion.img
    src="/decoradores/decor_static/circulo_azuul.png"
    alt=""
    className="decorador-publicacion"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.4, scale: 1, rotate: 360 }}
    transition={{ rotate: { duration: 15, repeat: Infinity, ease: 'linear' } }}
    style={{ top: '3%', left: '2%', width: 'clamp(60px, 8vw, 130px)', height: 'auto' }}
  />

  {/* Decoración 1 - Lateral izquierdo */}
  <motion.img
    src="/decoradores/decor_static/decoracion1.png"
    alt=""
    className="decorador-publicacion decorador-hide-mobile"
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 0.35, x: 0, y: [0, -12, 0] }}
    transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
    style={{ top: '45%', left: '1%', width: 'clamp(50px, 7vw, 110px)', height: 'auto' }}
  />

  {/* Redondo puteado - Abajo derecha */}
  <motion.img
    src="/decoradores/decor_static/redondo_puteado.png"
    alt=""
    className="decorador-publicacion"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.35, scale: 1, rotate: -360 }}
    transition={{ rotate: { duration: 25, repeat: Infinity, ease: 'linear' } }}
    style={{ bottom: '3%', right: '3%', width: 'clamp(50px, 7vw, 100px)', height: 'auto' }}
  />

  <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
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
        <div style={{ position: 'relative' }}>
          <Swiper
            className="publicaciones-swiper"
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={28}
            slidesPerView={1}
            loop={publicacionesOrdenadas.length > 3}
            autoplay={{ delay: 3200, disableOnInteraction: false, reverseDirection: true, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            navigation={{ nextEl: '.publicaciones-nav-next', prevEl: '.publicaciones-nav-prev' }}
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
              const descripcionLimpia = stripHtml(pub.publicaciones_descripcion || '').trim();

              return (
                <SwiperSlide key={pub.publicaciones_id} style={{ height: 'auto' }}>
                  <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3, ease: 'easeOut' }} style={{ height: '100%' }}>
                    <article
                      onClick={() => setSelectedImage(imgUrl || '')}
                      style={{
                        background: '#fff',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        height: CARD_HEIGHT,
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.22)',
                        cursor: 'pointer',
                        border: '1px solid rgba(0,0,0,0.04)',
                        transition: 'box-shadow 0.3s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 22px 55px rgba(0,0,0,0.4)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.22)'; }}
                    >
                      {/* Header compacto: badge + fecha en una fila, título con línea máx. 2 */}
                      <div
                        style={{
                          padding: '1.1rem 1.35rem 1rem',
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`,
                          color: '#fff',
                          flexShrink: 0,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', marginBottom: '0.6rem' }}>
                          <span
                            style={{
                              display: 'inline-block', padding: '0.28rem 0.8rem', background: 'rgba(255,255,255,0.2)',
                              fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', borderRadius: '50px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {pub.publicaciones_tipo || 'Publicación'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#FFD700', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            <FaRegCalendarAlt size={12} /> {fecha}
                          </span>
                        </div>
                        <h3
                          style={{
                            fontSize: 'clamp(1rem, 2.2vw, 1.12rem)',
                            fontWeight: 700,
                            margin: 0,
                            lineHeight: 1.35,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {pub.publicaciones_titulo}
                        </h3>
                      </div>

                      {/* Imagen */}
                      <div style={{ position: 'relative', height: IMAGE_HEIGHT, background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                        {imgUrl ? (
                          <motion.img
                            src={imgUrl}
                            alt={pub.publicaciones_titulo}
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.5 }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaNewspaper size={48} color={colors.primary} opacity={0.3} />
                          </div>
                        )}
                        <div
                          style={{
                            position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)',
                            borderRadius: '50%', width: '34px', height: '34px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)',
                          }}
                        >
                          <FiExternalLink size={15} color="#fff" />
                        </div>
                      </div>

                      {/* Cuerpo: descripción (clamp) + barra inferior fija con fecha/descarga */}
                      <div style={{ padding: '1.1rem 1.35rem 1.2rem', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                        <p
                          style={{
                            fontSize: '0.9rem',
                            color: '#5b6472',
                            lineHeight: 1.6,
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {descripcionLimpia || 'Documento oficial disponible para su consulta y descarga.'}
                        </p>

                        <div style={{ flex: 1 }} />
                      </div>
                    </article>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Flechas de navegación personalizadas */}
          <div className="swiper-button-prev publicaciones-nav-prev"></div>
          <div className="swiper-button-next publicaciones-nav-next"></div>
        </div>
      </FadeIn>
    ) : (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
        <FaNewspaper size={56} color="#64748b" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>No hay publicaciones disponibles</h3>
        <p style={{ color: '#94a3b8' }}>Pronto publicaremos nuevas noticias y actualizaciones.</p>
      </div>
    )}
  </div>

  {/* ============ MODAL PARA VER IMAGEN ============ */}
  <AnimatePresence>
    {selectedImage && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedImage('')}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 999999, cursor: 'pointer', padding: '1rem',
        }}
      >
        <motion.img
          src={selectedImage}
          alt="Publicación"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain',
            borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        />
        <button
          onClick={() => setSelectedImage('')}
          aria-label="Cerrar"
          style={{
            position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)',
            border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff',
            fontSize: '1.5rem', backdropFilter: 'blur(10px)',
          }}
        >
          ×
        </button>
      </motion.div>
    )}
  </AnimatePresence>
</section>






{/* ==================== CONTACTO (rediseño total, sin formulario) ==================== */}
<section
  id="contacto"
        style={{
          padding: 'clamp(2.5rem, 7vw, 5rem) 0',
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

  {/* Formas de fondo (manchas difuminadas) */}
  <div style={{ position: 'absolute', top: '-140px', right: '-120px', width: 'clamp(220px, 32vw, 380px)', height: 'clamp(220px, 32vw, 380px)', borderRadius: '50%', background: `${colors.primary}22`, filter: 'blur(70px)', zIndex: 0, pointerEvents: 'none' }}></div>
  <div style={{ position: 'absolute', bottom: '-160px', left: '-100px', width: 'clamp(240px, 34vw, 400px)', height: 'clamp(240px, 34vw, 400px)', borderRadius: '50%', background: `${colors.secondary}22`, filter: 'blur(70px)', zIndex: 0, pointerEvents: 'none' }}></div>

  {/* ============ DECORADORES ESTÁTICOS ANIMADOS + GRID ============ */}
  <style>{`
    .decorador-contacto {
      position: absolute;
      pointer-events: none;
      z-index: 1;
    }
    @media (max-width: 768px) {
      .decorador-contacto { opacity: 0.2 !important; }
      .decorador-hide-mobile { display: none; }
    }

    .contacto-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }
    @media (min-width: 640px) {
      .contacto-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    }
    @media (min-width: 1024px) {
      .contacto-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    }

    .contacto-card {
      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }
    .contacto-card:hover {
      box-shadow: 0 18px 45px rgba(0,0,0,0.35) !important;
    }

    .contacto-cta-btn {
      transition: all 0.25s ease;
    }
    .contacto-cta-btn:hover {
      transform: translateY(-3px);
    }

    .contacto-cta-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    @media (max-width: 640px) {
      .contacto-cta-row {
        flex-direction: column;
        text-align: center;
        justify-content: center;
      }
      .contacto-cta-row > div:last-child {
        justify-content: center;
        width: 100%;
      }
    }
  `}</style>

  
        {/* 1. Tuerca grande - Esquina superior derecha - GIRANDO */}
        <motion.img
          src="/decoradores/decor_static/tuerca_2.png"
          alt=""
          className="decorador-contacto"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 0.5, rotate: 360 }}
          transition={{ opacity: { duration: 0.8 }, rotate: { duration: 22, repeat: Infinity, ease: 'linear' } }}
          style={{ top: '-8%', right: '-6%', width: 'clamp(150px, 20vw, 350px)', height: 'auto' }}
        />

        {/* 2. Círculo azul grande - Superior izquierda - GIRANDO */}
        <motion.img
          src="/decoradores/decor_static/circulo_azuul.png"
          alt=""
          className="decorador-contacto"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.5, scale: 1, rotate: -360 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, rotate: { duration: 18, repeat: Infinity, ease: 'linear' } }}
          style={{ top: '3%', left: '2%', width: 'clamp(90px, 12vw, 200px)', height: 'auto' }}
        />

        {/* 3. Redondo con forma - Lateral izquierdo - GIRANDO */}
        <motion.img
          src="/decoradores/decor_static/redondo_con_forma.png"
          alt=""
          className="decorador-contacto"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.45, scale: 1, rotate: 360 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, rotate: { duration: 25, repeat: Infinity, ease: 'linear' } }}
          style={{ top: '35%', left: '-3%', width: 'clamp(100px, 14vw, 220px)', height: 'auto' }}
        />

        {/* 4. Redondo form2 - Lateral derecho - GIRANDO */}
        <motion.img
          src="/decoradores/decor_static/redondo_form2.png"
          alt=""
          className="decorador-contacto decorador-hide-mobile"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.45, scale: 1, rotate: -360 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
          style={{ top: '30%', right: '-3%', width: 'clamp(90px, 12vw, 200px)', height: 'auto' }}
        />

        {/* 5. Decoración 1 grande - Abajo izquierda - FLOTANDO */}
        <motion.img
          src="/decoradores/decor_static/decoracion1.png"
          alt=""
          className="decorador-contacto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.4, y: [0, -15, 0] }}
          transition={{ opacity: { duration: 0.8, delay: 0.3 }, y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } }}
          style={{ bottom: '3%', left: '3%', width: 'clamp(80px, 10vw, 160px)', height: 'auto' }}
        />

        {/* 6. Decoración 2 - Abajo derecha - FLOTANDO */}
        <motion.img
          src="/decoradores/decor_static/decoracion2.png"
          alt=""
          className="decorador-contacto decorador-hide-mobile"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.4, y: [0, -12, 0] }}
          transition={{ opacity: { duration: 0.8, delay: 0.4 }, y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' } }}
          style={{ bottom: '5%', right: '3%', width: 'clamp(70px, 9vw, 140px)', height: 'auto' }}
        />

        {/* 7. Líneas siksak - Centro superior - FLOTANDO */}
        <motion.img
          src="/decoradores/decor_static/3_lineas_siksak.png"
          alt=""
          className="decorador-contacto decorador-hide-mobile"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.3, y: [0, -10, 0] }}
          transition={{ opacity: { duration: 0.8, delay: 0.5 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
          style={{ top: '1%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(100px, 14vw, 220px)', height: 'auto' }}
        />

        {/* 8. Redondo puteado grande - Abajo centro - GIRANDO */}
        <motion.img
          src="/decoradores/decor_static/redondo_puteado.png"
          alt=""
          className="decorador-contacto"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1, rotate: 360 }}
          transition={{ opacity: { duration: 0.8, delay: 0.6 }, scale: { duration: 0.8, delay: 0.6 }, rotate: { duration: 26, repeat: Infinity, ease: 'linear' } }}
          style={{ bottom: '2%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(70px, 9vw, 150px)', height: 'auto' }}
        />
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
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
    <div className="contacto-grid" style={{ marginBottom: '2.25rem' }}>
      {[
        institucion?.institucion_direccion
          ? { icon: <FiMapPin size={24} />, label: 'Dirección', value: institucion.institucion_direccion, href: undefined }
          : null,
        whatsappNumber
          ? { icon: <FiPhone size={24} />, label: 'Teléfono', value: String(whatsappNumber), href: `tel:${whatsappNumber}` }
          : null,
        institucion?.institucion_correo1
          ? { icon: <FiMail size={24} />, label: 'Correo', value: institucion.institucion_correo1, href: `mailto:${institucion.institucion_correo1}` }
          : null,
        { icon: <FiClock size={24} />, label: 'Horario', value: 'Lun a Vie: 8:00–12:00 y 14:00–18:00', href: undefined },
      ]
        .filter((item): item is { icon: ReactElement; label: string; value: string; href: string | undefined } => item !== null)
        .map((item, index) => {
          const accent = index % 2 === 0 ? colors.primary : colors.secondary;
          const CardInner = (
            <div
              className="contacto-card"
              style={{
                background: '#fff', borderRadius: '18px', overflow: 'hidden', height: '100%',
                display: 'flex', flexDirection: 'column', boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ height: '4px', background: `linear-gradient(90deg, ${accent}, ${accent}80)` }}></div>
              <div style={{ padding: '1.85rem 1.4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.9rem', flex: 1 }}>
                <div
                  style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${accent}22, ${accent}10)`, color: accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${accent}30`,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ width: '100%' }}>
                  <strong style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>
                    {item.label}
                  </strong>
                  <p
                    style={{
                      margin: 0, color: '#1e293b', fontSize: 'clamp(0.85rem, 2vw, 0.98rem)', lineHeight: 1.5, fontWeight: 600,
                      wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '100%',
                    }}
                  >
                    {item.value}
                  </p>
                </div>
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
  </div>
</section>





        <Footer data={institucion} />
    </div>
  );
}
export default App;