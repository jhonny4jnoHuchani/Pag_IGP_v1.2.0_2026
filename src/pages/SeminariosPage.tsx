import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUsers,
  FaGraduationCap,
  FaWhatsapp,
  FaTimes,
  FaLaptop,
  FaBuilding,
} from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useCarreraData } from '../lib/api';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SeminariosPage() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  const colors = useThemeColors(institucion);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const [seminarioModal, setSeminarioModal] = useState<any>(null);

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
      if (e.key === 'Escape') setSeminarioModal(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const scrollToContent = () => {
    document.getElementById('seminarios-content')?.scrollIntoView({ behavior: 'smooth' });
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
          Cargando seminarios...
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

  const todosLosSeminarios = recursos?.cursos
    ?.filter((curso) => {
      const tipoCurso = curso.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() || '';
      const titulo = curso.det_titulo?.toUpperCase() || '';
      return (tipoCurso === 'SEMINARIOS' || titulo.includes('SEMINARIO')) && curso.det_estado === '1';
    })
    .sort((a, b) => new Date(b.det_fecha_ini).getTime() - new Date(a.det_fecha_ini).getTime()) || [];

  const seminariosFiltrados =
    filtroActivo === 'TODOS'
      ? todosLosSeminarios
      : todosLosSeminarios.filter((s) => {
          const tipo = s.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() || '';
          const titulo = s.det_titulo?.toUpperCase() || '';
          return tipo === filtroActivo.toUpperCase() || titulo.includes(filtroActivo.toUpperCase());
        });

  const categorias = [
    'TODOS',
    ...Array.from(
      new Set(
        todosLosSeminarios
          .map((s) => {
            const tipo = s.tipo_curso_otro?.tipo_conv_curso_nombre || 'SEMINARIO';
            return tipo === 'CURSOS' ? 'SEMINARIO' : tipo;
          })
          .filter(Boolean)
      )
    ),
  ];

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

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
        @keyframes floatCircle { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -20px) scale(1.08); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); } 50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.7); } }
        @keyframes floatDotGrid { 0% { background-position: 0 0; } 100% { background-position: 60px 60px; } }
        @keyframes cardShimmerSweep { 0% { transform: translateX(-120%) skewX(-15deg); } 100% { transform: translateX(220%) skewX(-15deg); } }
        .seminario-card-shell { position: relative; }
        .seminario-card-shell::before {
          content: ''; position: absolute; inset: -2px; border-radius: 18px;
          background: linear-gradient(135deg, ${colors.primary}, #FFD700, ${colors.secondary});
          opacity: 0; transition: opacity 0.35s ease; z-index: -1; filter: blur(6px);
        }
        .seminario-card-shell:hover::before { opacity: 0.65; }
        .seminario-card-sweep { position: absolute; top: 0; left: 0; width: 40%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent); pointer-events: none; opacity: 0; }
        .seminario-card-shell:hover .seminario-card-sweep { animation: cardShimmerSweep 1s ease forwards; opacity: 1; }
        @media (max-width: 1024px) {
          .seminarios-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .seminarios-grid { grid-template-columns: 1fr !important; }
          .seminario-image { height: 180px !important; }
          .seminario-content { padding: 1.25rem !important; }
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

            {/* Decoración: anillos punteados girando */}
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
                <FaGraduationCap style={{ fontSize: '2.5rem', color: colors.primary }} />
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
              Seminarios
            </motion.h1>

            <motion.div variants={heroItemVariants} style={{ width: '100px', height: '4px', background: colors.gradientPrimary, margin: '0 auto 1.25rem', borderRadius: '2px' }} />

            <motion.p variants={heroItemVariants} style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', color: '#fff', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.6)', fontWeight: 400 }}>
              {institucion?.institucion_nombre || 'Ingeniería de Gas y Petroquímica'}
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

        {/* ==================== SEMINARIOS ==================== */}
        <section id="seminarios-content" style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)', position: 'relative', overflow: 'hidden' }}>
          {/* Gradientes de fondo con colores institucionales */}
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

          {/* Decoración: cuadrícula de puntos flotante y blobs difuminados */}
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
              <motion.h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: '#fff', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '2rem' }}>
                Seminarios <span style={{ color: '#FFD700' }}>Disponibles</span>
              </motion.h2>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {categorias.map((cat) => {
                  const catColor = cat === 'TODOS' ? '#64748B' : colors.primary;
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
                      }}
                    >
                      {cat}
                    </motion.button>
                  );
                })}
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                {seminariosFiltrados.length} {seminariosFiltrados.length === 1 ? 'seminario disponible' : 'seminarios disponibles'}
              </p>
            </motion.div>

            {/* Grid de seminarios - Cards caen desde arriba */}
            {seminariosFiltrados.length > 0 ? (
              <div className="seminarios-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {seminariosFiltrados.map((seminario, idx) => (
                  <motion.div
                    key={seminario.iddetalle_cursos_academicos}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={fallFromTopVariants(idx)}
                    className="seminario-card-shell"
                  >
                    <motion.div
                      whileHover={{ y: -10, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      onClick={() => setSeminarioModal(seminario)}
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
                      <div className="seminario-card-sweep" />
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #FFD700, transparent)' }}></div>

                      {/* Imagen */}
                      <div className="seminario-image" style={{ position: 'relative', height: '180px', overflow: 'hidden', background: 'rgba(0,0,0,0.15)' }}>
                        {seminario.det_img_portada ? (
                          <>
                            <motion.img
                              src={getImageUrl(seminario.det_img_portada)}
                              alt={seminario.det_titulo}
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
                            <FaGraduationCap />
                          </div>
                        )}

                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.4rem 1rem', background: '#FFD700', color: '#1a1a2e', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                          {seminario.tipo_curso_otro?.tipo_conv_curso_nombre || 'SEMINARIO'}
                        </div>

                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.9)', color: colors.primary, borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {seminario.det_modalidad === 'VIRTUAL' ? <FaLaptop size={12} /> : <FaBuilding size={12} />}
                          {seminario.det_modalidad}
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="seminario-content" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem', lineHeight: 1.3, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                          {seminario.det_titulo}
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                          <FaCalendarAlt size={12} />
                          <span>{formatearFecha(seminario.det_fecha_ini)}</span>
                        </div>

                        <div
                          style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}
                          dangerouslySetInnerHTML={{ __html: seminario.det_descripcion }}
                        />

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                          {seminario.det_carga_horaria > 0 && (
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <FaClock size={11} /> {seminario.det_carga_horaria}h
                            </span>
                          )}
                          {seminario.det_lugar_curso && seminario.det_lugar_curso !== '---' && (
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <FaMapMarkerAlt size={11} /> {seminario.det_lugar_curso}
                            </span>
                          )}
                          {seminario.det_costo > 0 && (
                            <span style={{ fontSize: '0.7rem', color: '#FFD700', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <FaMoneyBillWave size={11} /> Bs. {seminario.det_costo.toLocaleString('es-BO')}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111827', borderRadius: '16px', border: `2px dashed ${colors.primary}30` }}>
                <FaGraduationCap style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3, color: colors.primary }} />
                <p style={{ color: '#94a3b8' }}>No hay seminarios disponibles.</p>
              </div>
            )}
          </div>

          {/* ==================== MODAL DE SEMINARIO ==================== */}
          <AnimatePresence>
            {seminarioModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'pointer', overflow: 'auto' }}
                onClick={() => setSeminarioModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: 50 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{ background: '#fff', borderRadius: '16px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflow: 'auto', cursor: 'default' }}
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
                      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>{seminarioModal.det_titulo}</h2>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                        {seminarioModal.tipo_curso_otro?.tipo_conv_curso_nombre || 'SEMINARIO'}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => setSeminarioModal(null)}
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
                  {seminarioModal.det_img_portada && (
                    <div style={{ width: '100%', height: '280px', overflow: 'hidden' }}>
                      <img src={getImageUrl(seminarioModal.det_img_portada)} alt={seminarioModal.det_titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ padding: '2rem' }}>
                    {/* Información principal */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '1.25rem',
                        marginBottom: '2rem',
                        padding: '1.5rem',
                        background: '#f8fafc',
                        borderRadius: '12px',
                      }}
                    >
                      <div>
                        <p style={styles.modalLabel}>
                          <FaCalendarAlt size={13} /> Fecha de Inicio
                        </p>
                        <p style={styles.modalValue}>{formatearFecha(seminarioModal.det_fecha_ini)}</p>
                      </div>
                      {seminarioModal.det_fecha_fin !== seminarioModal.det_fecha_ini && (
                        <div>
                          <p style={styles.modalLabel}>
                            <FaCalendarAlt size={13} /> Fecha de Fin
                          </p>
                          <p style={styles.modalValue}>{formatearFecha(seminarioModal.det_fecha_fin)}</p>
                        </div>
                      )}
                      <div>
                        <p style={styles.modalLabel}>
                          <FaClock size={13} /> Duración
                        </p>
                        <p style={styles.modalValue}>{seminarioModal.det_carga_horaria} horas</p>
                      </div>
                      <div>
                        <p style={styles.modalLabel}>
                          {seminarioModal.det_modalidad === 'VIRTUAL' ? <FaLaptop size={13} /> : <FaBuilding size={13} />} Modalidad
                        </p>
                        <p style={styles.modalValue}>{seminarioModal.det_modalidad}</p>
                      </div>
                      {seminarioModal.det_lugar_curso && seminarioModal.det_lugar_curso !== '---' && (
                        <div>
                          <p style={styles.modalLabel}>
                            <FaMapMarkerAlt size={13} /> Lugar
                          </p>
                          <p style={styles.modalValue}>{seminarioModal.det_lugar_curso}</p>
                        </div>
                      )}
                      {seminarioModal.det_costo > 0 && (
                        <div>
                          <p style={styles.modalLabel}>
                            <FaMoneyBillWave size={13} /> Costo
                          </p>
                          <p style={{ ...styles.modalValue, fontSize: '1.1rem', color: colors.primary, fontWeight: 700 }}>
                            Bs. {seminarioModal.det_costo.toLocaleString('es-BO')}
                          </p>
                        </div>
                      )}
                      {seminarioModal.det_cupo_max > 0 && (
                        <div>
                          <p style={styles.modalLabel}>
                            <FaUsers size={13} /> Cupos
                          </p>
                          <p style={styles.modalValue}>{seminarioModal.det_cupo_max} disponibles</p>
                        </div>
                      )}
                    </div>

                    {/* Descripción completa */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '1rem', fontWeight: 700 }}>Descripción del Seminario</h3>
                      <div style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.8, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: seminarioModal.det_descripcion }} />
                    </div>

                    {/* WhatsApp si existe */}
                    {seminarioModal.det_grupo_whatssap && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ padding: '1.25rem', background: '#dcfce7', borderRadius: '12px', border: `2px solid ${colors.primary}30`, marginBottom: '2rem' }}
                      >
                        <p style={{ fontSize: '0.9rem', color: '#166534', marginBottom: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          ¿Tienes consultas?
                        </p>
                        <motion.a
                          href={seminarioModal.det_grupo_whatssap.startsWith('http') ? seminarioModal.det_grupo_whatssap : `https://${seminarioModal.det_grupo_whatssap}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(37,211,102,0.4)' }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: '#25D366',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1rem',
                          }}
                        >
                          <FaWhatsapp size={18} /> Contactar por WhatsApp
                        </motion.a>
                      </motion.div>
                    )}

                    {/* Botón de inscripción */}
                    <motion.button
                      whileHover={{ y: -3, boxShadow: `0 8px 25px ${colors.primary}60` }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        padding: '1.1rem 2rem',
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        cursor: 'pointer',
                        boxShadow: `0 6px 20px ${colors.primary}40`,
                      }}
                    >
                      Inscribirme Ahora →
                    </motion.button>
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
    fontSize: '0.8rem',
    color: '#64748b',
    marginBottom: '0.25rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  modalValue: {
    fontSize: '1rem',
    color: '#1e293b',
    fontWeight: 600,
  },
};