import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FaChevronLeft, FaChevronRight, FaUserGraduate, FaBriefcase, FaCheck } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useCarreraData } from '../lib/api';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PerfilProfesionalPage() {
  const { institucion, contenido, loading, error } = useCarreraData();
  const colors = useThemeColors(institucion);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const portadas = contenido?.portada ?? [];
  const totalSlides = portadas.length;

  const campoTrabajoImages = [
    { title: "Plantas de procesamiento de gas natural", img: "/plantas de procesamiento.jpg" },
    { title: "Refinerías de petróleo", img: "./refinierias de petroleo.jpg" },
    { title: "Industrias petroquímicas", img: "./industrias petroquimicas.jpg" },
    { title: "Empresas de hidrocarburos", img: "/empresa de hidrocarburos.jpg" },
    { title: "Organismos de regulación y control", img: "/organismos de regulacion.jpg" }
  ];

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

  const nextCampo = useCallback(() => {
    setCarouselIndex((prev) => (prev === campoTrabajoImages.length - 1 ? 0 : prev + 1));
  }, [campoTrabajoImages.length]);

  const prevCampo = useCallback(() => {
    setCarouselIndex((prev) => (prev === 0 ? campoTrabajoImages.length - 1 : prev - 1));
  }, [campoTrabajoImages.length]);

  // Auto-avance del carrusel de portadas
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [totalSlides, nextSlide]);

  // Auto-avance del carrusel de campo de trabajo
  useEffect(() => {
    const timer = setInterval(nextCampo, 4000);
    return () => clearInterval(timer);
  }, [nextCampo]);

  const scrollToContent = () => {
    document.getElementById('perfil-content')?.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        @media (max-width: 768px) {
          .perfil-text { font-size: 1rem !important; line-height: 1.8 !important; }
          .hero-arrows { display: none !important; }
        }
      `}</style>

      <Header data={institucion} />

      <main>
        {/* ==================== HERO SECTION (50vh) ==================== */}
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
              <div style={{ width: '100%', height: '100%', background: colors.gradientPrimary }}></div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}></div>
          </div>

          {/* Flechas de navegación */}
          {totalSlides > 1 && (
            <div className="hero-arrows">
              <motion.button
                onClick={prevSlide}
                whileHover={{ scale: 1.15, background: colors.primary }}
                whileTap={{ scale: 0.9 }}
                aria-label="Portada anterior"
                style={{ ...styles.navArrow, left: '20px' }}
              >
                <FaChevronLeft size={18} />
              </motion.button>
              <motion.button
                onClick={nextSlide}
                whileHover={{ scale: 1.15, background: colors.primary }}
                whileTap={{ scale: 0.9 }}
                aria-label="Portada siguiente"
                style={{ ...styles.navArrow, right: '20px' }}
              >
                <FaChevronRight size={18} />
              </motion.button>
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
            {/* Logo 100px */}
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
                <span style={{ fontSize: '2rem', fontWeight: 800, color: colors.primary }}>IGP</span>
              )}
            </motion.div>

            {/* Título */}
            <motion.h1
              variants={heroItemVariants}
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
              Perfil Profesional
            </motion.h1>

            {/* Línea decorativa */}
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

            {/* Subtítulo */}
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

            {/* Indicadores */}
            {totalSlides > 1 && (
              <motion.div
                variants={heroItemVariants}
                style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '2rem' }}
              >
                {portadas.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    whileHover={{ scale: 1.2 }}
                    animate={{
                      width: index === currentSlide ? 32 : 10,
                      background: index === currentSlide ? colors.primary : 'rgba(255,255,255,0.5)',
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                    aria-label={`Ir a portada ${index + 1}`}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Flecha scroll */}
          <motion.button
            onClick={scrollToContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            aria-label="Descubre más"
            style={styles.scrollBtn}
          >
            <span style={{ fontSize: '0.75rem', letterSpacing: '2px', fontWeight: 600 }}>DESCUBRE MÁS</span>
            <span style={{ animation: 'bounceDown 1.6s ease-in-out infinite', display: 'flex' }}>
              <FiChevronDown size={22} />
            </span>
          </motion.button>
        </section>

        {/* ==================== PERFIL PROFESIONAL ==================== */}
        <section
          id="perfil-content"
          style={{
            padding: '0',
            background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 20% 30%, ${colors.primary}20 0%, transparent 70%),
              radial-gradient(ellipse at 80% 70%, ${colors.secondary}20 0%, transparent 70%)
            `,
            pointerEvents: 'none',
          }}></div>

          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionFadeIn}
              style={{ textAlign: 'center', padding: '6rem 0 4rem' }}
            >
              <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#fff', marginBottom: '1rem', fontWeight: 800 }}>
                Perfil Profesional
              </h2>
              <div style={{ width: '100px', height: '4px', background: colors.gradientPrimary, margin: '0 auto 1.5rem', borderRadius: '2px' }}></div>
              <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto' }}>
                Conoce el perfil de nuestros profesionales y sus oportunidades laborales
              </p>
            </motion.div>

            {/* PERFIL PROFESIONAL */}
            {institucion?.institucion_sobre_ins && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionFadeIn}
                style={{ padding: '4rem 0' }}
              >
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                  <Tilt
                    tiltMaxAngleX={8}
                    tiltMaxAngleY={8}
                    glareEnable={true}
                    glareMaxOpacity={0.15}
                    glareColor="#ffffff"
                    glarePosition="all"
                    scale={1.02}
                    transitionSpeed={1500}
                    style={{ display: 'inline-block', marginBottom: '2.5rem' }}
                  >
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1.75rem',
                      background: colors.gradientPrimary,
                      color: colors.textOnPrimary,
                      borderRadius: '50px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      boxShadow: `0 4px 20px ${colors.primaryMedium}`,
                    }}>
                      <FaUserGraduate size={20} />
                      Perfil del Profesional
                    </div>
                  </Tilt>

                  <div
                    className="perfil-text"
                    style={{
                      color: '#e2e8f0',
                      lineHeight: '2',
                      fontSize: 'clamp(1.05rem, 2vw, 1.15rem)',
                      textAlign: 'justify',
                    }}
                    dangerouslySetInnerHTML={{ __html: institucion.institucion_sobre_ins }}
                  />
                </div>
              </motion.div>
            )}

            {/* CAMPO DE TRABAJO - CARRUSEL FULL SCREEN */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionFadeIn}
              style={{
                position: 'relative',
                width: '100vw',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
              }}
            >
              {/* Badge Flotante */}
              <div style={{
                position: 'absolute',
                top: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 2rem',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)',
                color: colors.secondary,
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                border: `2px solid ${colors.secondary}60`,
                boxShadow: `0 4px 20px ${colors.secondary}40`,
              }}>
                <FaBriefcase size={18} />
                Campo de Trabajo
              </div>

              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  display: 'flex',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: `translateX(-${carouselIndex * 100}%)`,
                }}>
                  {campoTrabajoImages.map((item, idx) => (
                    <div key={idx} style={{ minWidth: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
                      <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.7) 100%)',
                      }}></div>

                      <div style={{
                        position: 'absolute',
                        bottom: '15%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                        width: '90%',
                        maxWidth: '900px',
                        zIndex: 10,
                      }}>
                        <div style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          background: idx % 2 === 0 ? colors.gradientPrimary : `linear-gradient(135deg, ${colors.secondary}, ${colors.secondary}cc)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '1.5rem',
                          margin: '0 auto 2rem',
                          boxShadow: `0 8px 30px ${idx % 2 === 0 ? colors.primary : colors.secondary}50`,
                          border: '3px solid rgba(255,255,255,0.3)',
                        }}>
                          <FaCheck size={28} />
                        </div>

                        <h3 style={{
                          color: '#fff',
                          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                          fontWeight: 800,
                          margin: '0 0 1rem',
                          lineHeight: 1.2,
                          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        }}>
                          {item.title}
                        </h3>

                        <p style={{
                          color: 'rgba(255,255,255,0.9)',
                          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                          fontWeight: 400,
                          margin: 0,
                          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        }}>
                          Área de Desarrollo Profesional
                        </p>

                        <div style={{
                          marginTop: '2rem',
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          letterSpacing: '2px',
                        }}>
                          {String(idx + 1).padStart(2, '0')} / {String(campoTrabajoImages.length).padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Flechas */}
                <motion.button
                  onClick={prevCampo}
                  whileHover={{ scale: 1.1, background: colors.primary }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Anterior"
                  style={{ ...styles.campoArrow, left: '2rem' }}
                >
                  <FaChevronLeft size={20} />
                </motion.button>
                <motion.button
                  onClick={nextCampo}
                  whileHover={{ scale: 1.1, background: colors.secondary }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Siguiente"
                  style={{ ...styles.campoArrow, right: '2rem' }}
                >
                  <FaChevronRight size={20} />
                </motion.button>

                {/* Dots */}
                <div style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '0.75rem',
                  zIndex: 20,
                }}>
                  {campoTrabajoImages.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      whileHover={{ scale: 1.2 }}
                      animate={{
                        width: carouselIndex === idx ? 40 : 10,
                        background: carouselIndex === idx ? colors.gradientPrimary : 'rgba(255,255,255,0.4)',
                        boxShadow: carouselIndex === idx ? `0 0 15px ${colors.primary}60` : 'none',
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ height: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
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
  campoArrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 20,
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    border: '2px solid rgba(255,255,255,0.3)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
};