import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { FaNewspaper, FaRegCalendarAlt } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import FadeIn from './FadeIn';
import type { Publicacion } from '../../lib/api';

const getImageUrl = (filename: string | null | undefined): string => {
  return filename || '';
};

const stripHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

const CARD_HEIGHT = 430;
const IMAGE_HEIGHT = 210;

interface PublicacionesSectionProps {
  publicacionesOrdenadas: Publicacion[];
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

/**
 * -------------------------------------------------------------------
 * Componente PublicacionesSection
 * Renderiza el carrusel de noticias y publicaciones.
 * -------------------------------------------------------------------
 */
const PublicacionesSection = ({ publicacionesOrdenadas, colors }: PublicacionesSectionProps) => {
  const [selectedImage, setSelectedImage] = useState('');

  return (
    <>
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

        {/* DECORADORES ESTÁTICOS ANIMADOS */}
        <style>{`
          .decorador-publicacion { position: absolute; pointer-events: none; z-index: 1; }
          @media (max-width: 768px) { .decorador-publicacion { opacity: 0.18 !important; } .decorador-hide-mobile { display: none; } }
          .publicaciones-swiper .swiper-pagination-bullet { background: #fff; opacity: 0.4; }
          .publicaciones-swiper .swiper-pagination-bullet-active { opacity: 1; background: ${colors.primary}; }
          .publicaciones-swiper .swiper-button-next,
          .publicaciones-swiper .swiper-button-prev { color: ${colors.primary} !important; background: rgba(255,255,255,0.1); width: 50px; height: 50px; border-radius: 50%; backdrop-filter: blur(10px); transition: all 0.3s ease; margin-top: -28px; }
          .publicaciones-swiper .swiper-button-next:hover,
          .publicaciones-swiper .swiper-button-prev:hover { background: ${colors.primary}; color: #fff !important; transform: scale(1.1); }
          .publicaciones-swiper .swiper-button-next::after,
          .publicaciones-swiper .swiper-button-prev::after { font-size: 1.15rem !important; font-weight: 900; }
          .publicaciones-nav-prev { left: -10px; }
          .publicaciones-nav-next { right: -10px; }
          @media (max-width: 900px) {
            .publicaciones-nav-prev { left: 4px; } .publicaciones-nav-next { right: 4px; }
            .publicaciones-swiper .swiper-button-next, .publicaciones-swiper .swiper-button-prev { width: 38px; height: 38px; }
            .publicaciones-swiper .swiper-button-next::after, .publicaciones-swiper .swiper-button-prev::after { font-size: 0.95rem !important; }
          }
        `}</style>

        <motion.img src="/decoradores/decor_static/tuerca_2.png" alt="" className="decorador-publicacion" initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 0.5, rotate: 360 }} transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }} style={{ top: '-5%', right: '-5%', width: 'clamp(100px, 15vw, 250px)' }} />
        <motion.img src="/decoradores/decor_static/circulo_azuul.png" alt="" className="decorador-publicacion" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.4, scale: 1, rotate: 360 }} transition={{ rotate: { duration: 15, repeat: Infinity, ease: 'linear' } }} style={{ top: '3%', left: '2%', width: 'clamp(60px, 8vw, 130px)' }} />
        <motion.img src="/decoradores/decor_static/decoracion1.png" alt="" className="decorador-publicacion decorador-hide-mobile" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.35, x: 0, y: [0, -12, 0] }} transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }} style={{ top: '45%', left: '1%', width: 'clamp(50px, 7vw, 110px)' }} />
        <motion.img src="/decoradores/decor_static/redondo_puteado.png" alt="" className="decorador-publicacion" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.35, scale: 1, rotate: -360 }} transition={{ rotate: { duration: 25, repeat: Infinity, ease: 'linear' } }} style={{ bottom: '3%', right: '3%', width: 'clamp(50px, 7vw, 100px)' }} />

        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', color: '#fff', marginBottom: '1rem', fontWeight: 800 }}> Noticias y Publicaciones </h2>
              <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, margin: '0 auto 1rem', borderRadius: '2px' }}></div>
              <p style={{ fontSize: '1.05rem', color: '#cbd5e1' }}>Mantente informado sobre las últimas novedades</p>
            </div>
          </FadeIn>

          {publicacionesOrdenadas.length > 0 ? (
            <FadeIn delay={0.1}>
              <div style={{ position: 'relative' }}>
                <Swiper
                  className="publicaciones-swiper" modules={[Autoplay, Pagination, Navigation]} spaceBetween={28} slidesPerView={1} loop={publicacionesOrdenadas.length > 3}
                  autoplay={{ delay: 3200, disableOnInteraction: false, reverseDirection: true, pauseOnMouseEnter: true }}
                  pagination={{ clickable: true }} navigation={{ nextEl: '.publicaciones-nav-next', prevEl: '.publicaciones-nav-prev' }}
                  breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} style={{ paddingBottom: '3.5rem' }}
                >
                  {publicacionesOrdenadas.map((pub) => {
                    const imgUrl = getImageUrl(pub.publicaciones_imagen);
                    const fecha = pub.publicaciones_fecha ? new Date(pub.publicaciones_fecha).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
                    const descripcionLimpia = stripHtml(pub.publicaciones_descripcion || '').trim();

                    return (
                      <SwiperSlide key={pub.publicaciones_id} style={{ height: 'auto' }}>
                        <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3, ease: 'easeOut' }} style={{ height: '100%' }}>
                          <article
                            onClick={() => setSelectedImage(imgUrl || '')}
                            style={{
                              background: '#fff', borderRadius: '20px', overflow: 'hidden', height: CARD_HEIGHT, display: 'flex', flexDirection: 'column',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.22)', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.04)', transition: 'box-shadow 0.3s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 22px 55px rgba(0,0,0,0.4)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.22)'; }}
                          >
                            <div style={{ padding: '1.1rem 1.35rem 1rem', background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`, color: '#fff', flexShrink: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', marginBottom: '0.6rem' }}>
                                <span style={{ display: 'inline-block', padding: '0.28rem 0.8rem', background: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', borderRadius: '50px', whiteSpace: 'nowrap' }}>
                                  {pub.publicaciones_tipo || 'Publicación'}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#FFD700', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                  <FaRegCalendarAlt size={12} /> {fecha}
                                </span>
                              </div>
                              <h3 style={{ fontSize: 'clamp(1rem, 2.2vw, 1.12rem)', fontWeight: 700, margin: 0, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {pub.publicaciones_titulo}
                              </h3>
                            </div>

                            <div style={{ position: 'relative', height: IMAGE_HEIGHT, background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                              {imgUrl ? (
                                <motion.img src={imgUrl} alt={pub.publicaciones_titulo} whileHover={{ scale: 1.08 }} transition={{ duration: 0.5 }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <FaNewspaper size={48} color={colors.primary} opacity={0.3} />
                                </div>
                              )}
                              <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                                <FiExternalLink size={15} color="#fff" />
                              </div>
                            </div>

                            <div style={{ padding: '1.1rem 1.35rem 1.2rem', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                              <p style={{ fontSize: '0.9rem', color: '#5b6472', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
      </section>

      {/* MODAL PARA VER IMAGEN */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedImage('')}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, cursor: 'pointer', padding: '1rem' }}
          >
            <motion.img
              src={selectedImage} alt="Publicación"
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            />
            <button
              onClick={() => setSelectedImage('')}
              aria-label="Cerrar"
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '1.5rem', backdropFilter: 'blur(10px)' }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublicacionesSection;
