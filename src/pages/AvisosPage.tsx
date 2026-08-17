import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaSearch, FaCalendarAlt, FaUserEdit, FaFileAlt, FaTimes, FaDownload, FaBullhorn, FaNewspaper, FaScroll } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useCarreraData } from '../lib/api';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AvisosPage() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  const colors = useThemeColors(institucion);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const [imagenModal, setImagenModal] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
      if (e.key === 'Escape') setImagenModal(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const scrollToContent = () => {
    document.getElementById('avisos-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} style={{ width: '60px', height: '60px', border: '4px solid #1e293b', borderTop: `4px solid ${colors.primary}`, borderRadius: '50%' }} />
        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: '#94a3b8', marginTop: 16, fontWeight: 500 }}>
          Cargando información...
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

  const todosLosAvisos = recursos?.upea_publicaciones
    ?.filter(pub => {
      const titulo = pub.publicaciones_titulo?.toUpperCase() || '';
      const tipo = pub.publicaciones_tipo?.toUpperCase() || '';
      return titulo.includes('AVISO') || titulo.includes('COMUNICADO') || tipo.includes('AVISO') || tipo.includes('COMUNICADO') || tipo.includes('GACETA') || titulo.includes('GACETA');
    })
    .map(pub => ({
      id: pub.publicaciones_id,
      titulo: pub.publicaciones_titulo,
      descripcion: pub.publicaciones_descripcion,
      fecha: pub.publicaciones_fecha,
      imagen: pub.publicaciones_imagen,
      tipo: pub.publicaciones_tipo || 'AVISO',
      autor: pub.publicaciones_autor,
      enlace: pub.publicaciones_documento || '#',
    }))
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) || [];

  const avisosFiltrados = filtroActivo === 'TODOS'
    ? todosLosAvisos
    : todosLosAvisos.filter(a => {
        const catUpper = filtroActivo.toUpperCase();
        const tipoUpper = a.tipo?.toUpperCase() || '';
        const tituloUpper = a.titulo?.toUpperCase() || '';
        return tipoUpper === catUpper || tituloUpper.includes(catUpper);
      });

  const categorias = ['TODOS', ...Array.from(new Set(todosLosAvisos.map(a => a.tipo || 'AVISO')))];

  const getCategoriaColor = (cat: string): string => {
    switch (cat.toUpperCase()) {
      case 'AVISO': return '#F59E0B';
      case 'COMUNICADO': return colors.secondary;
      case 'GACETA': return '#8B5CF6';
      default: return colors.primary;
    }
  };

  const getCategoriaIcon = (cat: string) => {
    switch (cat.toUpperCase()) {
      case 'AVISO': return <FaBullhorn size={14} />;
      case 'COMUNICADO': return <FaNewspaper size={14} />;
      case 'GACETA': return <FaScroll size={14} />;
      default: return <FaFileAlt size={14} />;
    }
  };

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
        @media (max-width: 1024px) {
          .avisos-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .avisos-grid { grid-template-columns: 1fr !important; }
          .aviso-image { height: 180px !important; }
          .aviso-content { padding: 1.25rem !important; }
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
              style={{ width: '110px', height: '110px', margin: '0 auto 1.5rem', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 15px 50px rgba(0,0,0,0.4), 0 0 0 8px ${colors.primary}30`, border: `5px solid ${colors.primary}`, overflow: 'hidden', animation: 'pulseGlow 3s ease-in-out infinite' }}
            >
              {institucion?.institucion_logo ? (
                <img src={getImageUrl(institucion.institucion_logo)} alt="Logo" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: colors.primary }}>IGP</span>
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
              Avisos y Comunicados
            </motion.h1>

            <motion.div variants={heroItemVariants} style={{ width: '100px', height: '4px', background: colors.gradientPrimary, margin: '0 auto 1.25rem', borderRadius: '2px' }} />

            <motion.p variants={heroItemVariants} style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', color: '#fff', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.6)', fontWeight: 400 }}>
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

        {/* ==================== AVISOS ==================== */}
        <section id="avisos-content" style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '5%', left: '3%', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`, filter: 'blur(40px)', animation: 'floatCircle 12s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '350px', height: '350px', borderRadius: '50%', background: `radial-gradient(circle, ${colors.secondary}15 0%, transparent 70%)`, filter: 'blur(40px)', animation: 'floatCircle 15s ease-in-out infinite reverse', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 1 }}>
            {/* Header + Filtros */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <motion.h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: '#fff', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '2rem' }}>
                Avisos y <span style={{ color: '#FFD700' }}>Comunicados</span>
              </motion.h2>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {categorias.map((cat) => {
                  const catColor = cat === 'TODOS' ? '#64748B' : getCategoriaColor(cat);
                  return (
                    <motion.button
                      key={cat}
                      onClick={() => setFiltroActivo(cat)}
                      whileHover={{ scale: 1.08, y: -3 }}
                      whileTap={{ scale: 0.92 }}
                      style={{
                        padding: '0.6rem 1.5rem',
                        background: filtroActivo === cat ? catColor : 'transparent',
                        color: filtroActivo === cat ? '#fff' : '#94a3b8',
                        border: `2px solid ${filtroActivo === cat ? catColor : '#334155'}`,
                        borderRadius: '50px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      {cat !== 'TODOS' && getCategoriaIcon(cat)}
                      {cat}
                    </motion.button>
                  );
                })}
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                {avisosFiltrados.length} {avisosFiltrados.length === 1 ? 'publicación' : 'publicaciones'}
              </p>
            </motion.div>

            {/* Grid 3 columnas responsive */}
            {avisosFiltrados.length > 0 ? (
              <div className="avisos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {avisosFiltrados.map((aviso, idx) => {
                  const catColor = getCategoriaColor(aviso.tipo);
                  const fecha = formatearFecha(aviso.fecha);

                  return (
                    <motion.div
                      key={`${aviso.id}-${idx}`}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={getCreativeVariants(idx)}
                    >
                      <motion.div
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        style={{
                          background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                          borderRadius: '16px',
                          overflow: 'hidden',
                          position: 'relative',
                          borderLeft: `5px solid ${catColor}`,
                          boxShadow: `0 10px 30px ${colors.primary}30`,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #FFD700, transparent)' }}></div>

                        <div style={{ position: 'absolute', top: '1rem', right: '-2.5rem', transform: 'rotate(45deg)', background: catColor, color: '#fff', padding: '0.35rem 2.5rem', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', zIndex: 5 }}>
                          {aviso.tipo}
                        </div>

                        <div className="aviso-image" style={{ position: 'relative', height: '180px', overflow: 'hidden', cursor: aviso.imagen ? 'pointer' : 'default', background: 'rgba(0,0,0,0.15)' }} onClick={() => aviso.imagen && setImagenModal(getImageUrl(aviso.imagen))}>
                          {aviso.imagen ? (
                            <>
                              <motion.img src={getImageUrl(aviso.imagen)} alt={aviso.titulo} whileHover={{ scale: 1.15 }} transition={{ duration: 0.6 }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                              >
                                <span style={{ padding: '0.6rem 1.25rem', background: '#fff', color: colors.primary, borderRadius: '50px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                                  <FaSearch size={12} /> Ver
                                </span>
                              </div>
                            </>
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'rgba(255,255,255,0.3)' }}>
                              <FaFileAlt />
                            </div>
                          )}
                        </div>

                        <div className="aviso-content" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', padding: '0.4rem 0.5rem', minWidth: '45px' }}>
                              <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, lineHeight: 1 }}>{fecha.dia}</span>
                              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.6rem', fontWeight: 600 }}>{fecha.mes}</span>
                              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>{fecha.anio}</span>
                            </div>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.3, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                              {aviso.titulo}
                            </h3>
                          </div>

                          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }} dangerouslySetInnerHTML={{ __html: aviso.descripcion }} />

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {aviso.autor && (
                              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <FaUserEdit size={12} /> {aviso.autor}
                              </span>
                            )}
                            {(aviso.enlace && aviso.enlace !== '#') && (
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                href={aviso.enlace}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ padding: '0.5rem 1rem', background: '#fff', color: colors.primary, textDecoration: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                              >
                                <FaDownload size={12} /> Descargar
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111827', borderRadius: '16px', border: `2px dashed ${colors.primary}30` }}>
                <FaFileAlt style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3, color: colors.primary }} />
                <p style={{ color: '#94a3b8' }}>No hay publicaciones disponibles.</p>
              </div>
            )}
          </div>

          {/* Modal */}
          <AnimatePresence>
            {imagenModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'pointer' }}
                onClick={() => setImagenModal(null)}
              >
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.2 }}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10000 }}
                >
                  <FaTimes />
                </motion.button>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  style={{ width: '100%', height: '100%', maxWidth: '1200px', maxHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={imagenModal} alt="Vista ampliada" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
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