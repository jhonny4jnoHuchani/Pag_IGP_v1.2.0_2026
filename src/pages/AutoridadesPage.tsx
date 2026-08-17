import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FaChevronLeft, FaChevronRight, FaUserTie, FaPhone, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useCarreraData } from '../lib/api';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AutoridadesPage() {
  const { institucion, contenido, loading, error } = useCarreraData();
  const colors = useThemeColors(institucion);
  const [currentSlide, setCurrentSlide] = useState(0);

  const portadas = contenido?.portada ?? [];
  const totalSlides = portadas.length;
  const autoridades = contenido?.autoridad ?? [];

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

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [totalSlides, nextSlide]);

  const scrollToContent = () => {
    document.getElementById('autoridades-content')?.scrollIntoView({ behavior: 'smooth' });
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
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        @keyframes floatCircle {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.08); }
        }
        @media (max-width: 768px) {
          .hero-arrows { display: none !important; }
          .auth-card { padding: 2rem 1.25rem !important; }
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
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }}></div>
          </div>

          {/* Flechas */}
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

          {/* Contenido */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroContainerVariants}
            style={{ textAlign: 'center', color: '#fff', padding: '2rem', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}
          >
            <motion.div
              variants={heroItemVariants}
              style={{
                width: '100px', height: '100px', margin: '0 auto 1.5rem',
                background: '#fff', borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 10px 40px rgba(0,0,0,0.35), 0 0 0 4px ${colors.primary}30`,
                border: `5px solid ${colors.primary}`, overflow: 'hidden',
              }}
            >
              {institucion?.institucion_logo ? (
                <img src={getImageUrl(institucion.institucion_logo)} alt="Logo" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 800, color: colors.primary }}>IGP</span>
              )}
            </motion.div>

            <motion.h1
              variants={heroItemVariants}
              style={{
                fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 900, color: '#FFD700',
                margin: '0 0 0.75rem', textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
                letterSpacing: '2px', lineHeight: 1.2, textTransform: 'uppercase',
              }}
            >
              Nuestras Autoridades
            </motion.h1>

            <motion.div
              variants={heroItemVariants}
              style={{ width: '80px', height: '4px', background: colors.gradientPrimary, margin: '0 auto 1.25rem', borderRadius: '2px' }}
            />

            <motion.p
              variants={heroItemVariants}
              style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: '#fff', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}
            >
              {institucion?.institucion_nombre || 'Ingeniería de Gas y Petroquímica'}
            </motion.p>

            {totalSlides > 1 && (
              <motion.div variants={heroItemVariants} style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '2rem' }}>
                {portadas.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    whileHover={{ scale: 1.2 }}
                    animate={{ width: index === currentSlide ? 32 : 10, background: index === currentSlide ? colors.primary : 'rgba(255,255,255,0.5)' }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                    aria-label={`Ir a portada ${index + 1}`}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Scroll indicator */}
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

        {/* ==================== AUTORIDADES ==================== */}
        <section
          id="autoridades-content"
          style={{
            padding: '6rem 0',
            background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Círculos decorativos animados */}
          <div style={{
            position: 'absolute', top: '10%', left: '5%', width: '250px', height: '250px',
            borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}30 0%, transparent 70%)`,
            filter: 'blur(20px)', animation: 'floatCircle 10s ease-in-out infinite', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '15%', right: '8%', width: '300px', height: '300px',
            borderRadius: '50%', background: `radial-gradient(circle, ${colors.secondary}30 0%, transparent 70%)`,
            filter: 'blur(20px)', animation: 'floatCircle 13s ease-in-out infinite reverse', pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
                Nuestras <span style={{ color: colors.secondary }}>Autoridades</span>
              </h2>
              <div style={{ width: '60px', height: '3px', background: colors.gradientPrimary, margin: '1rem auto 0', borderRadius: '2px' }}></div>
            </motion.div>

            {/* Grid de Autoridades - Cards más grandes */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              maxWidth: '1100px',
              margin: '0 auto',
            }}>
              {autoridades.map((auth, idx) => (
                <motion.div
                  key={auth.id_autoridad}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={cardVariants}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Tilt
                    tiltMaxAngleX={10}
                    tiltMaxAngleY={10}
                    scale={1.03}
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    glareColor="#ffffff"
                    glarePosition="all"
                    transitionSpeed={1500}
                  >
                    <div
                      className="auth-card"
                      style={{
                        textAlign: 'center',
                        padding: '2.5rem 2rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: `2px solid ${idx % 2 === 0 ? colors.primary : colors.secondary}30`,
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.boxShadow = `0 20px 50px ${idx % 2 === 0 ? colors.primary : colors.secondary}30`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Foto más grande */}
                      <div style={{
                        width: '200px',
                        height: '200px',
                        margin: '0 auto 1.75rem',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: `4px solid ${idx % 2 === 0 ? colors.primary : colors.secondary}`,
                        boxShadow: `0 10px 40px ${idx % 2 === 0 ? colors.primary : colors.secondary}40`,
                        background: '#fff',
                      }}>
                        <img
                          src={getImageUrl(auth.foto_autoridad)}
                          alt={auth.nombre_autoridad}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="%2394a3b8" viewBox="0 0 24 24"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>

                      {/* Icono decorativo */}
                      <div style={{
                        width: '50px', height: '50px', margin: '-3rem auto 1rem', position: 'relative', zIndex: 2,
                        background: colors.gradientPrimary, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: colors.textOnPrimary, boxShadow: `0 4px 15px ${colors.primaryMedium}`,
                      }}>
                        <FaUserTie size={22} />
                      </div>

                      {/* Nombre */}
                      <h3 style={{
                        color: '#fff', fontSize: '1.2rem', fontWeight: 700,
                        margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.3,
                      }}>
                        {auth.nombre_autoridad}
                      </h3>

                      {/* Cargo */}
                      <p style={{
                        color: idx % 2 === 0 ? colors.primary : colors.secondary,
                        fontSize: '0.9rem', fontWeight: 600, margin: '0 0 1.25rem',
                        letterSpacing: '1px', textTransform: 'uppercase',
                      }}>
                        {auth.cargo_autoridad}
                      </p>

                      {/* Línea divisoria */}
                      <div style={{
                        width: '50px', height: '2px',
                        background: idx % 2 === 0 ? colors.primary : colors.secondary,
                        margin: '0 auto 1.5rem', opacity: 0.6, borderRadius: '2px',
                      }}></div>

                      {/* Redes sociales */}
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        {auth.celular_autoridad && auth.celular_autoridad !== '234' && auth.celular_autoridad !== 'qwe' && (
                          <motion.a
                            whileHover={{ scale: 1.2, y: -3 }}
                            href={`https://wa.me/${auth.celular_autoridad}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                            title="WhatsApp"
                          >
                            <FaWhatsapp size={18} />
                          </motion.a>
                        )}
                        {auth.facebook_autoridad && auth.facebook_autoridad !== 'qweqwe' && auth.facebook_autoridad !== 'qwe' && (
                          <motion.a
                            whileHover={{ scale: 1.2, y: -3 }}
                            href={auth.facebook_autoridad.startsWith('http') ? auth.facebook_autoridad : `https://facebook.com/${auth.facebook_autoridad}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                            title="Facebook"
                          >
                            <FaFacebookF size={18} />
                          </motion.a>
                        )}
                        {(!auth.celular_autoridad || auth.celular_autoridad === '234') && (!auth.facebook_autoridad || auth.facebook_autoridad === 'qweqwe') && (
                          <span style={{ color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>Sin contacto disponible</span>
                        )}
                      </div>
                    </div>
                  </Tilt>
                </motion.div>
              ))}
            </div>

            {/* Fallback */}
            {!autoridades.length && (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
                <p style={{ fontSize: '1.1rem' }}>Actualmente no hay autoridades registradas.</p>
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
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', background: '#f8f9fa',
  },
  spinner: {
    width: '50px', height: '50px', border: '4px solid #f3f4f6',
    borderTop: '4px solid #349433', borderRadius: '50%', animation: 'spin 1s linear infinite',
  },
  btn: {
    padding: '0.75rem 2rem', color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 600, marginTop: '1rem', fontSize: '1rem',
  },
  navArrow: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 2,
    width: '44px', height: '44px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
  scrollBtn: {
    position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
    zIndex: 2, background: 'transparent', border: 'none', color: '#fff',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
    cursor: 'pointer', textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
  },
};