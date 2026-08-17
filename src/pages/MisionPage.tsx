import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FaChevronLeft, FaChevronRight, FaBullseye, FaEye, FaTrophy } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useCarreraData } from '../lib/api';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MisionPage() {
  
  const { institucion, contenido, loading, error } = useCarreraData();
  const colors = useThemeColors(institucion);
  const [currentSlide, setCurrentSlide] = useState(0);

  const portadas = contenido?.portada ?? [];
  const totalSlides = portadas.length;

  // ✅ Helper para URLs de imágenes
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Auto-avance del carrusel
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [totalSlides, nextSlide]);

  // Scroll suave inicial (como HistoriaPage)
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 130, behavior: 'smooth' });
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContent = () => {
    document.getElementById('mv-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <div style={{ ...styles.spinner, borderTopColor: colors.primary }}></div>
        <p style={{ color: '#666', marginTop: 16 }}>Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingBox}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error</h2>
        <p style={{ color: '#555' }}>{error}</p>
        <button
          style={{ ...styles.btn, background: colors.primary }}
          onClick={() => (window.location.href = '/')}
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Animaciones
const heroContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

  const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

const sectionFadeIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

  const blocks = [
    {
      id: 'mision',
      label: 'Nuestra Misión',
      icon: <FaBullseye size={20} />,
      content: institucion?.institucion_mision,
      color: colors.primary,
      border: `${colors.primary}40`,
    },
    {
      id: 'vision',
      label: 'Nuestra Visión',
      icon: <FaEye size={20} />,
      content: institucion?.institucion_vision,
      color: colors.secondary,
      border: `${colors.secondary}40`,
    },
    {
      id: 'objetivos',
      label: 'Objetivos de la Carrera',
      icon: <FaTrophy size={20} />,
      content: institucion?.institucion_objetivos,
      color: colors.tertiary || colors.primary,
      border: `${colors.tertiary || colors.primary}40`,
    },
  ].filter((b) => b.content);

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes floatCircle {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.08); }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        @media (max-width: 768px) {
          .mv-content { padding: 1.5rem !important; }
          .mv-title { font-size: 1.8rem !important; }
          .mv-text { font-size: 1rem !important; }
          .mv-hero-arrows { display: none !important; }
        }
      `}</style>

      <Header data={institucion} />

      <main>
        {/* ==================== HERO SECTION ==================== */}
        <section
          style={{
            position: 'relative',
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Carrusel con Ken Burns */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            {totalSlides > 0 ? (
              <AnimatePresence mode="sync">
                {portadas.map((portada, index) =>
                  index === currentSlide ? (
                    <motion.div
                      key={portada.portada_id}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1.08 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        opacity: { duration: 1 },
                        scale: { duration: 6, ease: 'linear' },
                      }}
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
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: colors.gradientPrimary,
                }}
              ></div>
            )}
            {/* Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
              }}
            ></div>
          </div>

          {/* Flechas de navegación */}
          {totalSlides > 1 && (
            <div className="mv-hero-arrows">
              <button
                onClick={prevSlide}
                aria-label="Portada anterior"
                style={{ ...styles.navArrow, left: '20px' }}
              >
                <FaChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Portada siguiente"
                style={{ ...styles.navArrow, right: '20px' }}
              >
                <FaChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Contenido Central */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroContainerVariants}
            style={{
              textAlign: 'center',
              color: '#fff',
              padding: '2rem',
              maxWidth: '1000px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <motion.div
              variants={heroItemVariants}
              style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 1.5rem',
                background: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 10px 40px rgba(0,0,0,0.35), 0 0 0 4px ${colors.primary}30`,
                border: `5px solid ${colors.primary}`,
                overflow: 'hidden',
              }}
            >
              {institucion?.institucion_logo ? (
                <img
                  src={getImageUrl(institucion.institucion_logo)}
                  alt="Logo"
                  style={{ width: '85%', height: '85%', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 800, color: colors.primary }}>
                  IGP
                </span>
              )}
            </motion.div>

            <motion.h1
              variants={heroItemVariants}
              className="mv-title"
              style={{
                fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
                fontWeight: 900,
                color: '#FFD700',
                margin: '0 0 0.75rem',
                textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
                letterSpacing: '2px',
                lineHeight: 1.2,
                textTransform: 'uppercase',
              }}
            >
              Misión y Visión
            </motion.h1>

            <motion.div
              variants={heroItemVariants}
              style={{
                width: '80px',
                height: '4px',
                background: colors.gradientPrimary,
                margin: '0 auto 1.25rem',
                borderRadius: '2px',
              }}
            />

            <motion.p
              variants={heroItemVariants}
              style={{
                fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
                color: '#fff',
                margin: 0,
                fontWeight: 400,
                textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
              }}
            >
              {institucion?.institucion_nombre || 'Ingeniería de Gas y Petroquímica'}
            </motion.p>

            {/* Indicadores del Carrusel */}
            {totalSlides > 1 && (
              <motion.div
                variants={heroItemVariants}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'center',
                  marginTop: '2rem',
                }}
              >
                {portadas.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    style={{
                      width: index === currentSlide ? '32px' : '10px',
                      height: '10px',
                      borderRadius: '6px',
                      background: index === currentSlide ? colors.primary : 'rgba(255,255,255,0.5)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    aria-label={`Ir a portada ${index + 1}`}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Flecha scroll animada */}
          <motion.button
            onClick={scrollToContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            aria-label="Descubre más"
            style={styles.scrollBtn}
          >
            <span style={{ fontSize: '0.75rem', letterSpacing: '2px', fontWeight: 600 }}>
              DESCUBRE MÁS
            </span>
            <span style={{ animation: 'bounceDown 1.6s ease-in-out infinite', display: 'flex' }}>
              <FiChevronDown size={22} />
            </span>
          </motion.button>
        </section>

        {/* ==================== MISIÓN, VISIÓN Y OBJETIVOS ==================== */}
        <section
          id="mv-content"
          style={{
            padding: '0',
            background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorativos animados de fondo */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.primary}30 0%, transparent 70%)`,
              filter: 'blur(20px)',
              animation: 'floatCircle 10s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '8%',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.secondary}30 0%, transparent 70%)`,
              filter: 'blur(20px)',
              animation: 'floatCircle 13s ease-in-out infinite reverse',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse at 20% 30%, ${colors.primary}20 0%, transparent 70%),
                radial-gradient(ellipse at 80% 70%, ${colors.secondary}20 0%, transparent 70%)
              `,
              pointerEvents: 'none',
            }}
          />

          <div
            className="mv-content"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0 2rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Header de sección */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionFadeIn}
              style={{ textAlign: 'center', padding: '6rem 0 4rem' }}
            >
              <h2
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  color: '#fff',
                  marginBottom: '1rem',
                  fontWeight: 800,
                }}
              >
                Misión, Visión y Objetivos
              </h2>
              <div
                style={{
                  width: '100px',
                  height: '4px',
                  background: colors.gradientPrimary,
                  margin: '0 auto 1.5rem',
                  borderRadius: '2px',
                }}
              ></div>
              <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto' }}>
                Conoce los pilares que guían nuestra formación académica
              </p>
            </motion.div>

            {/* Bloques Misión / Visión / Objetivos */}
            {blocks.map((block, i) => (
              <motion.div
                key={block.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionFadeIn}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '4rem 0',
                  borderBottom: i < blocks.length - 1 ? `1px solid ${block.border}` : 'none',
                }}
              >
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                  <Tilt
                    tiltMaxAngleX={8}
                    tiltMaxAngleY={8}
                    glareEnable={true}
                    glareMaxOpacity={0.15}
                    glareColor="#ffffff"
                    glarePosition="all"
                    scale={1.02}
                    transitionSpeed={1500}
                    style={{ display: 'inline-block', marginBottom: '2rem' }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1.75rem',
                        background: `linear-gradient(135deg, ${block.color}, ${block.color}cc)`,
                        color: '#fff',
                        borderRadius: '50px',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        border: `2px solid ${block.color}80`,
                        boxShadow: `0 4px 20px ${block.color}60, 0 0 40px ${block.color}30`,
                      }}
                    >
                      {block.icon}
                      {block.label}
                    </div>
                  </Tilt>

                  <div
                    className="mv-text"
                    style={{
                      color: '#e2e8f0',
                      lineHeight: '2',
                      fontSize: 'clamp(1.05rem, 2vw, 1.15rem)',
                      textAlign: 'justify',
                    }}
                    dangerouslySetInnerHTML={{ __html: block.content || '' }}
                  />
                </div>
              </motion.div>
            ))}
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
    background: '#f8f9fa',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #349433',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  btn: {
    padding: '0.75rem 2rem',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    marginTop: '1rem',
    fontSize: '1rem',
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  scrollBtn: {
    position: 'absolute',
    bottom: '1.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.35rem',
    cursor: 'pointer',
    textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
  },
};