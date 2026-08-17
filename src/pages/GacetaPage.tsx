import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaFilePdf, FaDownload, FaEye, FaTimes, FaBookOpen, FaCalendarAlt } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useCarreraData } from '../lib/api';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GacetaPage() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  const colors = useThemeColors(institucion);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const portadas = contenido?.portada ?? [];
  const totalSlides = portadas.length;

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  const getPdfUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/documentos/gacetas/${path}`;
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
      if (e.key === 'Escape') setSelectedPdf(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const scrollToContent = () => {
    document.getElementById('gacetas-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} style={{ width: '60px', height: '60px', border: '4px solid #1e293b', borderTop: `4px solid ${colors.primary}`, borderRadius: '50%' }} />
        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: '#94a3b8', marginTop: 16, fontWeight: 500 }}>
          Cargando gacetas...
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

  const gacetas = (recursos?.upea_gaceta_universitaria || [])
    .filter(gac => gac.gaceta_documento)
    .sort((a, b) => new Date(b.gaceta_fecha).getTime() - new Date(a.gaceta_fecha).getTime());

  const formatearFecha = (fecha: string) => {
    const d = new Date(fecha);
    const dia = d.getDate().toString().padStart(2, '0');
    const mes = d.toLocaleDateString('es-BO', { month: 'short' }).toUpperCase();
    const anio = d.getFullYear();
    return { dia, mes, anio };
  };

  const getCreativeVariants = (index: number): Variants => {
    const animations = [
      { x: -200, y: -150, rotate: -10, scale: 0.5 },
      { x: 200, y: -150, rotate: 10, scale: 0.5 },
      { x: -150, y: 150, rotate: -8, scale: 0.5 },
      { x: 150, y: 150, rotate: 8, scale: 0.5 },
      { x: 0, y: -200, rotate: 0, scale: 0.4 },
      { x: -150, y: 0, rotate: -15, scale: 0.5 },
      { x: 150, y: 0, rotate: 15, scale: 0.5 },
      { x: 0, y: 200, rotate: 5, scale: 0.4 },
    ];
    const anim = animations[index % animations.length];
    return {
      hidden: { opacity: 0, x: anim.x, y: anim.y, rotate: anim.rotate, scale: anim.scale },
      visible: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] } },
    };
  };

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
        @keyframes bounceDown { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        @keyframes floatCircle { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -20px) scale(1.08); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); } 50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.7); } }
        @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
        @media (max-width: 768px) {
          .hero-arrows { display: none !important; }
          .gaceta-section { padding: 4rem 0 !important; }
          .pdf-preview { height: 200px !important; }
          .pdf-icon { width: 70px !important; height: 70px !important; }
          .pdf-icon svg { font-size: 2rem !important; }
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
                      <img src={getImageUrl(portada.portada_imagen)} alt={portada.portada_titulo || `Portada ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            ) : (
              <div style={{ width: '100%', height: '100%', background: colors.gradientPrimary }}></div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)' }}></div>
            <div style={{ position: 'absolute', top: '-10%', left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'scanline 4s linear infinite' }}></div>
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
              whileHover={{ scale: 1.08, rotate: 8 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{ width: '100px', height: '100px', margin: '0 auto 1.5rem', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 15px 50px rgba(0,0,0,0.4), 0 0 0 8px ${colors.secondary}30`, border: `5px solid ${colors.secondary}`, overflow: 'hidden', animation: 'pulseGlow 3s ease-in-out infinite' }}
            >
              {institucion?.institucion_logo ? (
                <img src={getImageUrl(institucion.institucion_logo)} alt="Logo" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
              ) : (
                <FaBookOpen style={{ fontSize: '2.5rem', color: colors.secondary }} />
              )}
            </motion.div>

            <motion.h1
              variants={heroItemVariants}
              style={{
                fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)', fontWeight: 900,
                background: 'linear-gradient(90deg, #FFD700, #FFA500, #FF6347, #FFD700)',
                backgroundSize: '300% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 4s linear infinite',
                margin: '0 0 0.75rem',
                letterSpacing: '3px', lineHeight: 1.2, textTransform: 'uppercase',
              }}
            >
              Gaceta Universitaria
            </motion.h1>

            <motion.div variants={heroItemVariants} style={{ width: '100px', height: '4px', background: colors.gradientPrimary, margin: '0 auto 1.25rem', borderRadius: '2px' }} />

            <motion.p variants={heroItemVariants} style={{ fontSize: 'clamp(0.9rem, 2vw, 1.25rem)', color: '#fff', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.6)', fontWeight: 400 }}>
              {institucion?.institucion_nombre || 'Ingeniería de Gas y Petroquímica'}
            </motion.p>

            {totalSlides > 1 && (
              <motion.div variants={heroItemVariants} style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '2rem' }}>
                {portadas.map((_, index) => (
                  <motion.button key={index} onClick={() => setCurrentSlide(index)} whileHover={{ scale: 1.4 }} animate={{ width: index === currentSlide ? 40 : 10, background: index === currentSlide ? '#FFD700' : 'rgba(255,255,255,0.4)', boxShadow: index === currentSlide ? '0 0 20px #FFD700' : 'none' }} transition={{ duration: 0.3 }} style={{ height: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }} aria-label={`Ir a portada ${index + 1}`} />
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.button onClick={scrollToContent} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }} aria-label="Descubre más" style={styles.scrollBtn}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '3px', fontWeight: 600 }}>DESCUBRE MÁS</span>
            <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ display: 'flex' }}>
              <FiChevronDown size={24} />
            </motion.span>
          </motion.button>
        </section>

        {/* ==================== GACETAS (2 COLUMNAS + ICONO PDF ROJO) ==================== */}
        <section className="gaceta-section" id="gacetas-content" style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)', position: 'relative', overflow: 'hidden' }}>
          
          {/* Difuminaciones */}
          <div style={{ position: 'absolute', top: '-5%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${colors.secondary}20 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '450px', height: '450px', borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}25 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '60%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, #F59E0B15 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 2rem', background: '#DC2626', color: '#fff', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '2px', textTransform: 'uppercase', boxShadow: '0 8px 30px #DC262650' }}
              >
                <FaFilePdf size={16} />
                Documentación Oficial
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}
              >
                Nuestras <span style={{ color: '#FFD700' }}>Gacetas</span>
              </motion.h2>

              <motion.div initial={{ width: 0 }} whileInView={{ width: '100px' }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} style={{ height: '4px', background: colors.gradientPrimary, margin: '0 auto 2rem', borderRadius: '2px' }} />

              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500 }}>
                {gacetas.length} {gacetas.length === 1 ? 'documento disponible' : 'documentos disponibles'}
              </motion.p>
            </motion.div>

            {/* Grid exactamente 2 columnas */}
            {gacetas.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
                {gacetas.map((gaceta, idx) => {
                  const fecha = formatearFecha(gaceta.gaceta_fecha);
                  return (
                    <motion.div
                      key={gaceta.gaceta_id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={getCreativeVariants(idx)}
                    >
                      <motion.div
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        onClick={() => setSelectedPdf(getPdfUrl(gaceta.gaceta_documento))}
                        style={{
                          position: 'relative',
                          cursor: 'pointer',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: '#fff',
                          boxShadow: `0 15px 40px rgba(0,0,0,0.3)`,
                          border: `2px solid #DC262630`,
                        }}
                      >
                        {/* Vista previa - Icono PDF ROJO estilo Acrobat */}
                        <div className="pdf-preview" style={{ 
                          height: '220px', 
                          background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: '1rem',
                        }}>
                          <motion.div
                            className="pdf-icon"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{
                              width: '90px',
                              height: '90px',
                              background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                              borderRadius: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 10px 30px #DC262640',
                              border: '2px solid rgba(255,255,255,0.3)',
                            }}
                          >
                            <FaFilePdf style={{ fontSize: '2.5rem', color: '#fff' }} />
                          </motion.div>
                          <div style={{ textAlign: 'center', color: '#DC2626' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>Documento PDF</p>
                            <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: '0.5rem 0 0' }}>
                              Click para ver
                            </p>
                          </div>
                        </div>

                        {/* Badge tipo */}
                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.4rem 1rem', background: '#DC2626', color: '#fff', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', zIndex: 5 }}>
                          {gaceta.gaceta_tipo || 'GACETA'}
                        </div>

                        {/* Contenido */}
                        <div style={{ padding: '1.5rem 2rem 2rem', background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <FaBookOpen style={{ color: '#FFD700', fontSize: '1.2rem' }} />
                            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: 0, lineHeight: 1.4, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                              {gaceta.gaceta_titulo}
                            </h3>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                            <FaCalendarAlt size={14} />
                            <span>{fecha.dia} {fecha.mes} {fecha.anio}</span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(getPdfUrl(gaceta.gaceta_documento), '_blank');
                              }}
                              style={{ padding: '0.6rem 1.25rem', background: '#fff', color: '#DC2626', border: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                            >
                              <FaEye size={14} /> Ver PDF
                            </motion.button>

                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              href={getPdfUrl(gaceta.gaceta_documento)}
                              download
                              onClick={(e) => e.stopPropagation()}
                              style={{ padding: '0.6rem 1.25rem', background: 'transparent', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '0.8rem', border: '2px solid #fff', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <FaDownload size={14} /> Descargar
                            </motion.a>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200 }} style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111827', borderRadius: '20px', border: `2px dashed ${colors.primary}30` }}>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <FaFilePdf style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3, color: '#DC2626' }} />
                </motion.div>
                <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>No hay gacetas disponibles</h3>
                <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Pronto publicaremos nueva documentación oficial.</p>
              </motion.div>
            )}
          </div>

          {/* Modal PDF */}
          <AnimatePresence>
            {selectedPdf && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'pointer' }}
                onClick={() => setSelectedPdf(null)}
              >
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.2 }}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}
                >
                  <FaTimes />
                </motion.button>

                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{ background: '#fff', borderRadius: '20px', padding: '3rem', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, #DC2626, #991B1B)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <FaFilePdf size={32} />
                  </div>

                  <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem', fontWeight: 700 }}>Abrir Documento</h3>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                    El documento se abrirá en una nueva pestaña.
                  </p>

                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={selectedPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#DC2626', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 15px #DC262640', marginBottom: '0.75rem' }}
                  >
                    <FaEye size={16} /> Abrir PDF
                  </motion.a>

                  <br />

                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    href={selectedPdf}
                    download
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: 'transparent', color: '#DC2626', textDecoration: 'none', borderRadius: '50px', fontWeight: 600, fontSize: '0.9rem', border: '2px solid #DC2626' }}
                  >
                    <FaDownload size={14} /> Descargar
                  </motion.a>
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

// ESTILOS
const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  loadingBox: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', background: '#0a0a0a',
  },
  spinner: {
    width: '50px', height: '50px', border: '4px solid #1e293b',
    borderTop: '4px solid #349433', borderRadius: '50%', animation: 'spin 1s linear infinite',
  },
  btn: {
    padding: '0.75rem 2rem', color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 600, marginTop: '1rem', fontSize: '1rem',
  },
  navArrow: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 2,
    width: '46px', height: '46px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.25)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
  scrollBtn: {
    position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
    zIndex: 2, background: 'transparent', border: 'none', color: '#fff',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
    cursor: 'pointer', textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
  },
};