import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaUserEdit,
  FaFilePdf,
  FaClock,
  FaQuoteLeft,
  FaTimes,
  FaBook,
} from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useCarreraData } from '../lib/api';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Tiempo de lectura estimado a partir del HTML de la descripción
function tiempoLectura(html: string): number {
  const texto = html.replace(/<[^>]+>/g, ' ');
  const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}

type Orientacion = 'landscape' | 'portrait' | null;

export default function PublicacionesPage() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  const colors = useThemeColors(institucion);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [publicacionModal, setPublicacionModal] = useState<any>(null);
  const [orientacion, setOrientacion] = useState<Orientacion>(null);

  const portadas = contenido?.portada ?? [];
  const totalSlides = portadas.length;

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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPublicacionModal(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const scrollToContent = () => {
    document.getElementById('publicaciones-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  const abrirModal = (pub: any) => {
    setOrientacion(null); // reset: se calcula al cargar la imagen
    setPublicacionModal(pub);
  };

  const cerrarModal = () => {
    setPublicacionModal(null);
    setOrientacion(null);
  };

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setOrientacion(naturalWidth >= naturalHeight ? 'landscape' : 'portrait');
  };

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{ width: '60px', height: '60px', border: '4px solid #1e293b', borderTop: `4px solid ${colors.primary}`, borderRadius: '50%' }}
        />
        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: '#94a3b8', marginTop: 16, fontWeight: 500 }}>
          Cargando publicaciones...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingBox}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error</h2>
          <p style={{ color: '#555' }}>{error}</p>
          <button style={{ ...styles.btn, background: colors.primary }} onClick={() => (window.location.href = '/')}>
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    );
  }

  const publicaciones = recursos?.upea_publicaciones
    ?.filter((pub) => pub.publicaciones_id)
    .sort((a, b) => new Date(b.publicaciones_fecha).getTime() - new Date(a.publicaciones_fecha).getTime()) || [];

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const fallFromTopVariants = (index: number): Variants => ({
    hidden: { opacity: 0, y: -300, rotate: -5, scale: 0.7 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.9, delay: index * 0.12, ease: [0.34, 1.56, 0.64, 1] },
    },
  });

  const heroContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); } 50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.7); } }
        @keyframes floatDotGrid { 0% { background-position: 0 0; } 100% { background-position: 60px 60px; } }
        @keyframes cardShimmerSweep { 0% { transform: translateX(-120%) skewX(-15deg); } 100% { transform: translateX(220%) skewX(-15deg); } }
        .pub-card-shell { position: relative; }
        .pub-card-shell::before {
          content: ''; position: absolute; inset: -2px; border-radius: 18px;
          background: linear-gradient(135deg, ${colors.primary}, #FFD700, ${colors.secondary});
          opacity: 0; transition: opacity 0.35s ease; z-index: -1; filter: blur(6px);
        }
        .pub-card-shell:hover::before { opacity: 0.65; }
        .pub-card-sweep { position: absolute; top: 0; left: 0; width: 40%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent); pointer-events: none; opacity: 0; }
        .pub-card-shell:hover .pub-card-sweep { animation: cardShimmerSweep 1s ease forwards; opacity: 1; }
        /* Esquina doblada tipo "papel" */
        .pub-fold {
          position: absolute; top: 0; right: 0; width: 0; height: 0;
          border-style: solid; border-width: 0 34px 34px 0;
          border-color: transparent #FFD700 transparent transparent;
          filter: drop-shadow(-2px 2px 3px rgba(0,0,0,0.25));
          z-index: 2;
        }
        @media (max-width: 1024px) {
          .publicaciones-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .publicaciones-grid { grid-template-columns: 1fr !important; }
          .pub-image { height: 180px !important; }
          .pub-content { padding: 1.25rem !important; }
          .hero-arrows { display: none !important; }
          .modal-portrait-layout { flex-direction: column !important; }
          .modal-portrait-layout .modal-img-side { width: 100% !important; max-height: 45vh !important; }
        }
      `}</style>

      <Header data={institucion} />

      <main>
        {/* ==================== HERO (50vh) ==================== */}
        <section style={{ position: 'relative', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            {totalSlides > 0 ? (
              <AnimatePresence mode="sync">
                {portadas.map((portada, index) =>
                  index === currentSlide ? (
                    <motion.div
                      key={portada.portada_id}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1.12 }}
                      exit={{ opacity: 0 }}
                      transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: 'linear' } }}
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
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)' }}></div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', top: '8%', right: '4%', width: '160px', height: '160px', border: `2px dashed ${colors.secondary}40`, borderRadius: '50%', pointerEvents: 'none' }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', bottom: '6%', left: '5%', width: '110px', height: '110px', border: `2px dashed ${colors.primary}40`, borderRadius: '50%', pointerEvents: 'none' }}
            />
          </div>

          {totalSlides > 1 && (
            <div className="hero-arrows">
              <motion.button onClick={prevSlide} whileHover={{ scale: 1.2, background: colors.primary }} whileTap={{ scale: 0.9 }} aria-label="Portada anterior" style={{ ...styles.navArrow, left: '20px' }}>
                <FaChevronLeft size={18} />
              </motion.button>
              <motion.button onClick={nextSlide} whileHover={{ scale: 1.2, background: colors.primary }} whileTap={{ scale: 0.9 }} aria-label="Portada siguiente" style={{ ...styles.navArrow, right: '20px' }}>
                <FaChevronRight size={18} />
              </motion.button>
            </div>
          )}

          <motion.div initial="hidden" animate="visible" variants={heroContainerVariants} style={{ textAlign: 'center', color: '#fff', padding: '2rem', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <motion.div
              variants={heroItemVariants}
              animate={{ y: [0, -8, 0] }}
              transition={{ y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } }}
              whileHover={{ scale: 1.08, rotate: 8 }}
              style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 1.5rem',
                background: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 15px 50px rgba(0,0,0,0.4), 0 0 0 8px ${colors.primary}30`,
                border: `5px solid ${colors.primary}`,
                overflow: 'hidden',
                animation: 'pulseGlow 3s ease-in-out infinite',
              }}
            >
              {institucion?.institucion_logo ? (
                <img src={getImageUrl(institucion.institucion_logo)} alt="Logo" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
              ) : (
                <FaBook style={{ fontSize: '2.2rem', color: colors.primary }} />
              )}
            </motion.div>

            <motion.h1
              variants={heroItemVariants}
              style={{
                fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)',
                fontWeight: 900,
                background: 'linear-gradient(90deg, #FFD700, #FFA500, #FF6347, #FFD700)',
                backgroundSize: '300% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 4s linear infinite',
                margin: '0 0 0.75rem',
                letterSpacing: '3px',
                lineHeight: 1.2,
                textTransform: 'uppercase',
              }}
            >
              Publicaciones
            </motion.h1>

            <motion.div variants={heroItemVariants} style={{ width: '100px', height: '4px', background: colors.gradientPrimary, margin: '0 auto 1.25rem', borderRadius: '2px' }} />

            <motion.p variants={heroItemVariants} style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', color: '#fff', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.6)', fontWeight: 400 }}>
              Publicaciones y Producción Científica
            </motion.p>

            {totalSlides > 1 && (
              <motion.div variants={heroItemVariants} style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '2rem' }}>
                {portadas.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    whileHover={{ scale: 1.4 }}
                    animate={{ width: index === currentSlide ? 40 : 10, background: index === currentSlide ? '#FFD700' : 'rgba(255,255,255,0.4)' }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.button onClick={scrollToContent} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }} style={styles.scrollBtn}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '3px', fontWeight: 600 }}>DESCUBRE MÁS</span>
            <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <FiChevronDown size={24} />
            </motion.span>
          </motion.button>
        </section>

        {/* ==================== PUBLICACIONES ==================== */}
        <section id="publicaciones-content" style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)', position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: `radial-gradient(ellipse at 20% 30%, ${colors.primary}90 0%, transparent 70%), radial-gradient(ellipse at 80% 70%, ${colors.secondary}90 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          ></div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.15,
              backgroundImage: `radial-gradient(${colors.primary} 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
              animation: 'floatDotGrid 12s linear infinite',
              pointerEvents: 'none',
            }}
          />
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '10%', left: '-5%', width: '320px', height: '320px', borderRadius: '50%', background: colors.primary, opacity: 0.08, filter: 'blur(80px)', pointerEvents: 'none' }}
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', bottom: '5%', right: '-5%', width: '360px', height: '360px', borderRadius: '50%', background: colors.secondary, opacity: 0.08, filter: 'blur(90px)', pointerEvents: 'none' }}
          />

          <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <motion.h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: '#fff', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                Nuestras <span style={{ color: '#FFD700' }}>Publicaciones</span>
              </motion.h2>
              <div style={{ width: '100px', height: '4px', background: colors.gradientPrimary, margin: '0 auto 1.25rem', borderRadius: '2px' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                {publicaciones.length} {publicaciones.length === 1 ? 'publicación disponible' : 'publicaciones disponibles'}
              </p>
            </motion.div>

            {/* Grid de publicaciones */}
            {publicaciones.length > 0 ? (
              <div className="publicaciones-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {publicaciones.map((pub, idx) => {
                  const minutos = tiempoLectura(pub.publicaciones_descripcion || '');
                  return (
                    <motion.div
                      key={pub.publicaciones_id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={fallFromTopVariants(idx)}
                      className="pub-card-shell"
                    >
                      <motion.div
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        onClick={() => abrirModal(pub)}
                        style={{
                          background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                          borderRadius: '16px',
                          overflow: 'hidden',
                          position: 'relative',
                          borderLeft: '5px solid #FFD700',
                          boxShadow: `0 10px 30px ${colors.primary}30`,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                        }}
                      >
                        <div className="pub-card-sweep" />
                        <div className="pub-fold" />
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #FFD700, transparent)' }}></div>

                        {/* Imagen */}
                        <div className="pub-image" style={{ position: 'relative', height: '180px', overflow: 'hidden', background: 'rgba(0,0,0,0.15)' }}>
                          {pub.publicaciones_imagen ? (
                            <>
                              <motion.img
                                src={getImageUrl(pub.publicaciones_imagen)}
                                alt={pub.publicaciones_titulo}
                                whileHover={{ scale: 1.15 }}
                                transition={{ duration: 0.6 }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <div
                                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.3s' }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                              />
                            </>
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'rgba(255,255,255,0.3)' }}>
                              <FaBook />
                            </div>
                          )}

                          <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.4rem 1rem', background: '#FFD700', color: '#1a1a2e', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                            {pub.publicaciones_tipo || 'Publicación'}
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="pub-content" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem', marginBottom: '0.6rem' }}>
                            <FaCalendarAlt size={11} />
                            <span>{formatearFecha(pub.publicaciones_fecha)}</span>
                            <span style={{ opacity: 0.5 }}>•</span>
                            <FaClock size={11} />
                            <span>{minutos} min de lectura</span>
                          </div>

                          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: '0 0 0.6rem', lineHeight: 1.3, textShadow: '0 1px 2px rgba(0,0,0,0.3)', minHeight: '2.5em' }}>
                            {pub.publicaciones_titulo}
                          </h3>

                          <div style={{ position: 'relative', paddingLeft: '1.1rem', flex: 1, marginBottom: '0.75rem' }}>
                            <FaQuoteLeft size={12} style={{ position: 'absolute', left: 0, top: '0.15rem', color: 'rgba(255,215,0,0.5)' }} />
                            <div
                              style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                              dangerouslySetInnerHTML={{ __html: pub.publicaciones_descripcion }}
                            />
                          </div>

                          {pub.publicaciones_autor && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FFD700', fontSize: '0.72rem', fontWeight: 700, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.65rem' }}>
                              <FaUserEdit size={12} /> {pub.publicaciones_autor}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111827', borderRadius: '16px', border: `2px dashed ${colors.primary}30` }}>
                <FaBook style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3, color: colors.primary }} />
                <p style={{ color: '#94a3b8' }}>No hay publicaciones disponibles.</p>
              </div>
            )}
          </div>

          {/* ==================== MODAL DE PUBLICACIÓN ==================== */}
          <AnimatePresence>
            {publicacionModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'pointer', overflow: 'auto' }}
                onClick={cerrarModal}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: 50 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    maxWidth: orientacion === 'portrait' ? '980px' : '780px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    cursor: 'default',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header del modal */}
                  <div
                    style={{
                      position: 'sticky',
                      top: 0,
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      color: '#fff',
                      padding: '1.5rem 2rem',
                      borderRadius: '16px 16px 0 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      zIndex: 2,
                    }}
                  >
                    <div>
                      <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.4rem', fontWeight: 700 }}>{publicacionModal.publicaciones_titulo}</h2>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>{publicacionModal.publicaciones_tipo || 'Publicación'}</p>
                    </div>
                    <motion.button
                      onClick={cerrarModal}
                      whileHover={{ rotate: 90, background: 'rgba(255,255,255,0.3)' }}
                      whileTap={{ scale: 0.85 }}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                      aria-label="Cerrar"
                    >
                      <FaTimes />
                    </motion.button>
                  </div>

                  {/* ===== Layout que se adapta a la orientación de la imagen ===== */}
                  <div
                    className={orientacion === 'portrait' ? 'modal-portrait-layout' : ''}
                    style={{
                      display: 'flex',
                      flexDirection: orientacion === 'portrait' ? 'row' : 'column',
                    }}
                  >
                    {publicacionModal.publicaciones_imagen && (
                      <div
                        className="modal-img-side"
                        style={{
                          width: orientacion === 'portrait' ? '42%' : '100%',
                          flexShrink: 0,
                          background: '#0a0a0a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          maxHeight: orientacion === 'portrait' ? '75vh' : '420px',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={getImageUrl(publicacionModal.publicaciones_imagen)}
                          alt={publicacionModal.publicaciones_titulo}
                          onLoad={handleImgLoad}
                          style={{
                            width: '100%',
                            height: orientacion === 'portrait' ? '100%' : 'auto',
                            maxHeight: orientacion === 'portrait' ? '75vh' : '420px',
                            objectFit: 'contain',
                            display: orientacion === null ? 'none' : 'block',
                          }}
                        />
                        {/* Placeholder mientras se mide la imagen, para no saltar de layout */}
                        {orientacion === null && (
                          <div style={{ width: '100%', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                              style={{ width: '36px', height: '36px', border: '3px solid #1e293b', borderTop: `3px solid ${colors.primary}`, borderRadius: '50%' }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contenido */}
                    <div style={{ padding: '2rem', flex: 1, minWidth: 0 }}>
                      {/* Info principal */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '1.25rem',
                          marginBottom: '1.75rem',
                          padding: '1.25rem',
                          background: '#f8fafc',
                          borderRadius: '12px',
                        }}
                      >
                        <div>
                          <p style={styles.modalLabel}>
                            <FaCalendarAlt size={13} /> Fecha de Publicación
                          </p>
                          <p style={styles.modalValue}>{formatearFecha(publicacionModal.publicaciones_fecha)}</p>
                        </div>
                        <div>
                          <p style={styles.modalLabel}>
                            <FaClock size={13} /> Lectura estimada
                          </p>
                          <p style={styles.modalValue}>{tiempoLectura(publicacionModal.publicaciones_descripcion || '')} min</p>
                        </div>
                        {publicacionModal.publicaciones_autor && (
                          <div>
                            <p style={styles.modalLabel}>
                              <FaUserEdit size={13} /> Autor
                            </p>
                            <p style={{ ...styles.modalValue, color: colors.primary }}>{publicacionModal.publicaciones_autor}</p>
                          </div>
                        )}
                      </div>

                      {/* Descripción */}
                      <div style={{ marginBottom: '1.75rem' }}>
                        <h3 style={{ fontSize: '1.15rem', color: '#1e293b', marginBottom: '0.9rem', fontWeight: 700 }}>Descripción</h3>
                        <div style={{ color: '#475569', fontSize: '0.98rem', lineHeight: 1.8, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: publicacionModal.publicaciones_descripcion }} />
                      </div>

                      {/* Documento */}
                      {publicacionModal.publicaciones_documento && (
                        <motion.a
                          href={publicacionModal.publicaciones_documento}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -3, boxShadow: `0 8px 25px ${colors.secondary}60` }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            width: '100%',
                            padding: '1.05rem 2rem',
                            background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondary}cc)`,
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            boxShadow: `0 6px 20px ${colors.secondary}40`,
                          }}
                        >
                          <FaFilePdf size={18} /> Descargar Documento PDF
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <Footer data={institucion} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  loadingBox: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
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
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.25)',
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
  modalLabel: {
    fontSize: '0.78rem',
    color: '#64748b',
    marginBottom: '0.25rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  modalValue: {
    fontSize: '0.98rem',
    color: '#1e293b',
    fontWeight: 600,
  },
};