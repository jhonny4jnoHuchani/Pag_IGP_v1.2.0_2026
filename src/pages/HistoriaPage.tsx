import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { TypeAnimation } from 'react-type-animation';
import { FaBook, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useCarreraData } from '../lib/api';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ✅ Convierte el HTML de la historia a texto plano, conservando saltos de párrafo
// (react-type-animation solo puede "tipear" texto plano, no HTML)
const stripHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  div.querySelectorAll('p, br, div, li').forEach((el) => {
    el.insertAdjacentText('afterend', '\n\n');
  });
  return (div.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
};

export default function HistoriaPage() {
  const { institucion, contenido, loading, error } = useCarreraData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startTyping, setStartTyping] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  // ✅ Colores institucionales validados (con fallback #349433 / #00B9D1 / #FFFFFF)
  // Vienen de institucion.colorinstitucion[0] (API) y se validan en useThemeColors
  const colors = useThemeColors(institucion);

  const totalSlides = contenido?.portada?.length || 0;

  // ✅ Texto plano listo para animar como máquina de escribir
  const historiaPlainText = useMemo(() => {
    if (!institucion?.institucion_historia) return '';
    return stripHtml(institucion.institucion_historia);
  }, [institucion?.institucion_historia]);

  const goToSlide = useCallback((index: number) => setCurrentSlide(index), []);
  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);
  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  // Auto-avance del carrusel
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  // ✅ Deslizamiento breve y suave al entrar a la página (se queda abajo, no regresa)
  useEffect(() => {
    if (loading || error) return;

    let rafId: number;
    const startDelay = setTimeout(() => {
      const startY = window.scrollY;
      const targetY = 130;
      const distance = targetY - startY;
      const duration = 1100; // ms — cuanto más alto, más suave/lento
      let startTime: number | null = null;

      // easeInOutCubic: arranque y frenado progresivos, sin brusquedad
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * easeInOutCubic(progress));
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        }
      };

      rafId = requestAnimationFrame(step);
    }, 500);

    return () => {
      clearTimeout(startDelay);
      cancelAnimationFrame(rafId);
    };
  }, [loading, error]);

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#666', marginTop: 16 }}>Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingBox}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error</h2>
        <p style={{ color: '#555' }}>{error}</p>
        <button style={styles.btn} onClick={() => (window.location.href = '/')}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  // ✅ Helper para URLs de imágenes - Maneja URLs completas y relativas
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
        .historia-text::first-letter {
          font-size: 3.4rem;
          font-weight: 900;
          float: left;
          line-height: 0.85;
          margin-right: 0.5rem;
          color: ${colors.secondary};
        }
        .historia-text { white-space: pre-wrap; }
        .historia-content { transition: box-shadow 0.4s ease, transform 0.4s ease; }
        .type-cursor { color: ${colors.secondary}; }

        /* Grid responsivo: texto + espacio del logo */
        .historia-grid {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 3rem;
          align-items: start;
        }
        .historia-logo-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 220px;
        }
        @media (max-width: 900px) {
          .historia-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .historia-logo-slot {
            order: -1;
            min-height: 0;
          }
        }
        @media (max-width: 768px) {
          .historia-content { padding: 1.75rem !important; }
          .historia-title { font-size: 1.8rem !important; }
          .historia-text { font-size: 1rem !important; }
          .historia-text::first-letter { font-size: 2.4rem; }
          .carousel-arrow { display: none !important; }
        }
      `}</style>

      <Header data={institucion} />

      <main>
        {/* ==================== HERO SECTION CON CARRUSEL ==================== */}
        <section style={{
          position: 'relative',
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>

          {/* Carrusel de Portadas con efecto Ken Burns */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -2 }}>
            {contenido?.portada && contenido.portada.length > 0 ? (
              <AnimatePresence>
                {contenido.portada.map((portada, index) =>
                  index === currentSlide ? (
                    <motion.div
                      key={portada.portada_id}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1.08 }}
                      exit={{ opacity: 0 }}
                      transition={{ opacity: { duration: 1 }, scale: { duration: 6, ease: 'linear' } }}
                      style={{ position: 'absolute', inset: 0 }}
                    >
                      <img
                        src={getImageUrl(portada.portada_imagen)}
                        alt={portada.portada_titulo || `Portada ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            ) : (
              <div style={{ width: '100%', height: '100%', background: colors.gradientPrimary }}></div>
            )}
          </div>

          {/* Overlay cinematográfico con toque de color institucional */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%), linear-gradient(120deg, ${colors.primaryLight} 0%, transparent 60%)`,
            zIndex: -1
          }}></div>

          {/* Flechas de navegación del carrusel */}
          {totalSlides > 1 && (
            <>
              <motion.button
                className="carousel-arrow"
                onClick={goToPrev}
                whileHover={{ scale: 1.15, background: colors.primary }}
                whileTap={{ scale: 0.9 }}
                aria-label="Portada anterior"
                style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                <FaChevronLeft size={16} />
              </motion.button>
              <motion.button
                className="carousel-arrow"
                onClick={goToNext}
                whileHover={{ scale: 1.15, background: colors.primary }}
                whileTap={{ scale: 0.9 }}
                aria-label="Siguiente portada"
                style={{
                  position: 'absolute',
                  right: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                <FaChevronRight size={16} />
              </motion.button>
            </>
          )}

          {/* Contenido Central */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            style={{
              textAlign: 'center',
              color: '#fff',
              padding: '2rem',
              maxWidth: '1200px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 1
            }}
          >
            <br /> <br />  <br /> <br /> <br />
            {/* Título */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                color: '#FFD700',
                margin: '0 0 0.75rem',
                textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
                letterSpacing: '2px',
                lineHeight: 1.2,
                textTransform: 'uppercase'
              }}
            >
              Nuestra Historia
            </motion.h1>

            {/* Línea decorativa bajo el título */}
            <motion.div
              variants={{ hidden: { opacity: 0, width: 0 }, visible: { opacity: 1, width: '80px' } }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                height: '4px',
                background: colors.gradientPrimary,
                margin: '0 auto 1.5rem',
                borderRadius: '2px'
              }}
            />

            {/* Subtítulo - Consumo del servicio */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                color: '#fff',
                margin: '0 0 2rem',
                fontWeight: 400,
                textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              {institucion?.institucion_nombre || 'Ingeniería de Gas y Petroquímica'}
            </motion.p>

            {/* Indicadores del Carrusel */}
            {totalSlides > 1 && (
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                transition={{ duration: 0.6 }}
                style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginTop: '2.5rem' }}
              >
                {contenido!.portada!.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToSlide(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                      width: index === currentSlide ? 40 : 12,
                      background: index === currentSlide ? colors.primary : 'rgba(255,255,255,0.5)',
                      boxShadow: index === currentSlide ? `0 0 12px ${colors.primary}` : 'none'
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      height: '12px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    aria-label={`Ir a portada ${index + 1}`}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Flecha de Scroll Animada */}
          <motion.a
            href="#historia-content"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.1 }}
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '50%',
              translateX: '-50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#fff',
              textDecoration: 'none',
              textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
              zIndex: 2
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1.5px' }}>
              DESCUBRE MÁS
            </span>
            <FiChevronDown size={22} />
          </motion.a>
        </section>

        {/* ==================== SECCIÓN DE HISTORIA CON DEGRADADOS ==================== */}
        <section id="historia-content" style={{
          padding: '6rem 0',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* ✅ Gradientes de fondo decorativos con colores institucionales */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 20% 30%, ${colors.primary}90 0%, transparent 70%),
              radial-gradient(ellipse at 80% 70%, ${colors.secondary}90 0%, transparent 70%)
            `,
            pointerEvents: 'none',
            zIndex: 0
          }}></div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>

            {/* Header de la sección */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                color: '#fff',
                marginBottom: '1rem',
                fontWeight: 800
              }}>
                Historia de la Carrera
              </h2>
              <div style={{
                width: '80px',
                height: '4px',
                background: colors.gradientPrimary,
                margin: '0 auto 1.5rem',
                borderRadius: '2px'
              }}></div>
              <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto' }}>
                Conoce nuestra trayectoria, logros y compromiso con la excelencia académica
              </p>
            </motion.div>

            {/* ✅ Contenido de Historia - CON DEGRADADOS INSTITUCIONALES */}
            {institucion?.institucion_historia ? (
              <motion.div
                className="historia-content"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                whileHover={{ boxShadow: `0 20px 60px ${colors.primary}30` }}
                onViewportEnter={() => setStartTyping(true)}
                style={{
                  background: colors.gradientLight,
                  borderRadius: '20px',
                  padding: '4rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  border: `2px solid ${colors.primaryLight}`,
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Elementos decorativos de fondo */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', top: '-50px', right: '-50px',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: `radial-gradient(circle, ${colors.primaryLight} 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }}
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  style={{
                    position: 'absolute', bottom: '-50px', left: '-50px',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: `radial-gradient(circle, ${colors.secondaryLight} 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }}
                />

                {/* Grid: texto (izquierda) + espacio del logo (derecha, aparece al terminar de escribir) */}
                <div className="historia-grid" style={{ position: 'relative', zIndex: 1 }}>

                  {/* Columna de texto */}
                  <div>
                    {/* Badge con degradado */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1.5rem',
                        background: colors.gradientPrimary,
                        color: colors.textOnPrimary,
                        borderRadius: '50px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        marginBottom: '2rem',
                        boxShadow: `0 4px 15px ${colors.primaryMedium}`
                      }}
                    >
                      <FaBook size={18} />
                      <span>Nuestra Historia</span>
                    </motion.div>

                    {/* ✅ Texto de Historia - Efecto máquina de escribir (se tipea una sola vez al entrar en vista) */}
                    <div
                      className="historia-text"
                      style={{
                        color: '#f1f5f9',
                        lineHeight: '2',
                        fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                        textAlign: 'justify',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        minHeight: '3rem'
                      }}
                    >
                      {startTyping && historiaPlainText && (
                        <TypeAnimation
                          key="historia-typing"
                          sequence={[historiaPlainText, () => setShowLogo(true)]}
                          speed={70}
                          cursor={true}
                          repeat={0}
                          wrapper="span"
                          style={{ whiteSpace: 'pre-wrap', display: 'inline' }}
                        />
                      )}
                    </div>

                    {/* Línea decorativa inferior con degradado */}
                    <div style={{
                      width: '100px',
                      height: '4px',
                      background: colors.gradientPrimary,
                      margin: '3rem auto 0',
                      borderRadius: '2px'
                    }}></div>
                  </div>

                  {/* Columna del logo — aparece cuando termina de escribirse la historia */}
                  <div className="historia-logo-slot">
                    <AnimatePresence>
                      {showLogo && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.4, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                          style={{ textAlign: 'center' }}
                        >
                          <Tilt
                            tiltMaxAngleX={12}
                            tiltMaxAngleY={12}
                            scale={1.05}
                            glareEnable={true}
                            glareMaxOpacity={0.25}
                            glareColor="#ffffff"
                            glareBorderRadius="50%"
                            transitionSpeed={1500}
                          >
                            <div style={{
                              width: '170px',
                              height: '170px',
                              background: '#fff',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                              boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 0 6px ${colors.primaryLight}`,
                              border: `5px solid ${colors.primary}`,
                              overflow: 'hidden'
                            }}>
                              {institucion?.institucion_logo ? (
                                <img
                                  src={getImageUrl(institucion.institucion_logo)}
                                  alt="Logo institucional"
                                  style={{ width: '85%', height: '85%', objectFit: 'contain' }}
                                />
                              ) : (
                                <span style={{ fontSize: '3.2rem', fontWeight: 800, color: colors.primary }}>IGP</span>
                              )}
                            </div>
                          </Tilt>


                          {/* Logo UPEA - archivo estático en /public */}
                          <motion.img
                            src="/upeaLogo.png"
                            alt="Logo Universidad Pública de El Alto"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 0.95, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            style={{
                              width: '200px',
                              height: 'auto',
                              marginTop: '1.5rem',
                              display: 'block',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))'
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '20px',
                border: `2px dashed ${colors.primaryLight}`
              }}>
                <FaBook size={64} style={{ opacity: 0.3, marginBottom: '1rem', color: colors.primary }} />
                <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.75rem' }}>
                  No hay información de historia disponible
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                  Pronto publicaremos la historia de nuestra institución.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer data={institucion} />
    </div>
  );
}

// ESTILOS
const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  loadingBox: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fa'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #349433',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  btn: {
    padding: '0.75rem 2rem',
    background: '#349433',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '1rem',
    fontSize: '1rem'
  }
};