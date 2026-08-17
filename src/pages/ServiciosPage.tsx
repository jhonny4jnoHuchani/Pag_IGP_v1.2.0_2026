import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  FaChevronLeft,
  FaChevronRight,
  FaPhone,
  FaWhatsapp,
  FaTimes,
  FaTools,
} from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useCarreraData } from '../lib/api';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ServiciosPage() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  const colors = useThemeColors(institucion);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [servicioModal, setServicioModal] = useState<any>(null);

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
      if (e.key === 'Escape') setServicioModal(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const scrollToContent = () => {
    document.getElementById('servicios-content')?.scrollIntoView({ behavior: 'smooth' });
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
          Cargando servicios...
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

  const servicios = recursos?.serviciosCarrera
    ?.filter((serv) => serv.serv_active === '1')
    .sort((a, b) => a.serv_id - b.serv_id) || [];

  // Animación de caída desde arriba
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
        .servicio-card-shell { position: relative; }
        .servicio-card-shell::before {
          content: ''; position: absolute; inset: -2px; border-radius: 18px;
          background: linear-gradient(135deg, ${colors.primary}, #FFD700, ${colors.secondary});
          opacity: 0; transition: opacity 0.35s ease; z-index: -1; filter: blur(6px);
        }
        .servicio-card-shell:hover::before { opacity: 0.65; }
        .servicio-card-sweep { position: absolute; top: 0; left: 0; width: 40%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent); pointer-events: none; opacity: 0; }
        .servicio-card-shell:hover .servicio-card-sweep { animation: cardShimmerSweep 1s ease forwards; opacity: 1; }
        @media (max-width: 1024px) {
          .servicios-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .servicios-grid { grid-template-columns: 1fr !important; }
          .servicio-image { height: 180px !important; }
          .servicio-content { padding: 1.25rem !important; }
          .hero-arrows { display: none !important; }
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
                <FaTools style={{ fontSize: '2.2rem', color: colors.primary }} />
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
              Servicios
            </motion.h1>

            <motion.div variants={heroItemVariants} style={{ width: '100px', height: '4px', background: colors.gradientPrimary, margin: '0 auto 1.25rem', borderRadius: '2px' }} />

            <motion.p variants={heroItemVariants} style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', color: '#fff', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.6)', fontWeight: 400 }}>
              Servicios que ofrecemos a la comunidad universitaria
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

        {/* ==================== SERVICIOS ==================== */}
        <section id="servicios-content" style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)', position: 'relative', overflow: 'hidden' }}>
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
                Nuestros <span style={{ color: '#FFD700' }}>Servicios</span>
              </motion.h2>
              <div style={{ width: '100px', height: '4px', background: colors.gradientPrimary, margin: '0 auto 1.25rem', borderRadius: '2px' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                {servicios.length} {servicios.length === 1 ? 'servicio disponible' : 'servicios disponibles'}
              </p>
            </motion.div>

            {/* Grid de servicios - Cards caen desde arriba */}
            {servicios.length > 0 ? (
              <div className="servicios-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {servicios.map((servicio, idx) => (
                  <motion.div
                    key={servicio.serv_id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={fallFromTopVariants(idx)}
                    className="servicio-card-shell"
                  >
                    <motion.div
                      whileHover={{ y: -10, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      onClick={() => setServicioModal(servicio)}
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
                      <div className="servicio-card-sweep" />
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #FFD700, transparent)' }}></div>

                      {/* Imagen */}
                      <div className="servicio-image" style={{ position: 'relative', height: '180px', overflow: 'hidden', background: 'rgba(0,0,0,0.15)' }}>
                        {servicio.serv_imagen ? (
                          <>
                            <motion.img
                              src={getImageUrl(servicio.serv_imagen)}
                              alt={servicio.serv_nombre}
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
                            <FaTools />
                          </div>
                        )}

                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.4rem 1rem', background: '#FFD700', color: '#1a1a2e', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                          Servicio
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="servicio-content" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.75rem', lineHeight: 1.3, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                          {servicio.serv_nombre}
                        </h3>

                        <div
                          style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, marginBottom: '1rem' }}
                          dangerouslySetInnerHTML={{ __html: servicio.serv_descripcion }}
                        />

                        {servicio.serv_nro_celular && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FFD700', fontSize: '0.75rem', fontWeight: 700 }}>
                            <FaPhone size={11} /> {servicio.serv_nro_celular}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111827', borderRadius: '16px', border: `2px dashed ${colors.primary}30` }}>
                <FaTools style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3, color: colors.primary }} />
                <p style={{ color: '#94a3b8' }}>No hay servicios disponibles.</p>
              </div>
            )}
          </div>

          {/* ==================== MODAL DE SERVICIO ==================== */}
          <AnimatePresence>
            {servicioModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'pointer', overflow: 'auto' }}
                onClick={() => setServicioModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: 50 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{ background: '#fff', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto', cursor: 'default' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header del modal */}
                  <div
                    style={{
                      position: 'sticky',
                      top: 0,
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      color: '#fff',
                      padding: '2rem',
                      borderRadius: '16px 16px 0 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      zIndex: 1,
                    }}
                  >
                    <div>
                      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>{servicioModal.serv_nombre}</h2>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>Servicio Institucional</p>
                    </div>
                    <motion.button
                      onClick={() => setServicioModal(null)}
                      whileHover={{ rotate: 90, background: 'rgba(255,255,255,0.3)' }}
                      whileTap={{ scale: 0.85 }}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '1.1rem',
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

                  {/* Imagen */}
                  {servicioModal.serv_imagen && (
                    <div style={{ width: '100%', height: '280px', overflow: 'hidden' }}>
                      <img src={getImageUrl(servicioModal.serv_imagen)} alt={servicioModal.serv_nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ padding: '2rem' }}>
                    {/* Descripción completa */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '1rem', fontWeight: 700 }}>Descripción del Servicio</h3>
                      <div style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.8, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: servicioModal.serv_descripcion }} />
                    </div>

                    {/* Información de contacto */}
                    {servicioModal.serv_nro_celular && (
                      <div
                        style={{
                          padding: '1.25rem',
                          background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
                          borderRadius: '12px',
                          border: `2px solid ${colors.primary}30`,
                          marginBottom: '1.5rem',
                        }}
                      >
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FaPhone size={13} /> Información y Consultas
                        </p>
                        <p style={{ fontSize: '1.25rem', color: colors.primary, fontWeight: 700, margin: 0 }}>{servicioModal.serv_nro_celular}</p>
                      </div>
                    )}

                    {/* Botón de contacto por WhatsApp */}
                    {servicioModal.serv_nro_celular && (
                      <motion.a
                        href={`https://wa.me/591${servicioModal.serv_nro_celular.toString().replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -3, boxShadow: '0 6px 20px rgba(37,211,102,0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.6rem',
                          width: '100%',
                          padding: '1.1rem 2rem',
                          background: '#25D366',
                          color: '#fff',
                          textDecoration: 'none',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          boxShadow: '0 4px 15px rgba(37,211,102,0.3)',
                        }}
                      >
                        <FaWhatsapp size={20} /> Contactar por WhatsApp
                      </motion.a>
                    )}
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
};