import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FiExternalLink, FiLink } from 'react-icons/fi';
import FadeIn from './FadeIn';
import type { LinkExterno } from '../../lib/api';

const getImageUrl = (filename: string | null | undefined): string => {
  return filename || '';
};

interface ExploraSectionProps {
  links: LinkExterno[] | undefined;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

/**
 * -------------------------------------------------------------------
 * Componente ExploraSection
 * Renderiza los enlaces externos e internos de la institución (Inscripciones, Campus)
 * -------------------------------------------------------------------
 */
const ExploraSection = ({ links, colors }: ExploraSectionProps) => {
  return (
    <section
      id="explora-nuestra-institucion"
      style={{
        padding: 'clamp(4rem, 10vw, 8rem) 0',
        background: `linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at 20% 30%, ${colors.primary}90 0%, transparent 70%), radial-gradient(ellipse at 80% 70%, ${colors.secondary}90 0%, transparent 70%)`,
          pointerEvents: 'none', zIndex: 0,
        }}
      ></div>

      {/* DECORADORES ESTÁTICOS */}
      <motion.img src="/decoradores/decor_static/cometa.png" alt="" initial={{ opacity: 0, rotate: -30, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} style={{ position: 'absolute', top: '5%', left: '3%', width: 'clamp(60px, 8vw, 100px)', pointerEvents: 'none', zIndex: 1, opacity: 0.6, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }} />
      <motion.img src="/decoradores/decor_static/circulo_azuul.png" alt="" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, rotate: 360 }} transition={{ opacity: { duration: 0.6, delay: 0.5 }, scale: { duration: 0.6, delay: 0.5 }, rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }} style={{ position: 'absolute', top: '8%', right: '5%', width: 'clamp(80px, 10vw, 140px)', pointerEvents: 'none', zIndex: 1, opacity: 0.5 }} />
      <motion.img src="/decoradores/decor_static/redondo_con_forma.png" alt="" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, rotate: -360 }} transition={{ opacity: { duration: 0.7, delay: 0.3 }, scale: { duration: 0.7, delay: 0.3 }, rotate: { duration: 30, repeat: Infinity, ease: 'linear' } }} style={{ position: 'absolute', top: '25%', left: '2%', width: 'clamp(100px, 14vw, 200px)', pointerEvents: 'none', zIndex: 1, opacity: 0.4 }} />
      <motion.img src="/decoradores/decor_static/redondo_form2.png" alt="" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0, rotate: 360 }} transition={{ opacity: { duration: 0.7, delay: 0.6 }, x: { duration: 0.7, delay: 0.6 }, rotate: { duration: 22, repeat: Infinity, ease: 'linear' } }} style={{ position: 'absolute', top: '35%', right: '2%', width: 'clamp(90px, 10vw, 160px)', pointerEvents: 'none', zIndex: 1, opacity: 0.4 }} />
      <motion.img src="/decoradores/decor_static/decoracion1.png" alt="" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }} style={{ position: 'absolute', bottom: '5%', left: '5%', width: 'clamp(70px, 9vw, 120px)', pointerEvents: 'none', zIndex: 1, opacity: 0.45 }} />
      <motion.img src="/decoradores/decor_static/decoracion2.png" alt="" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }} style={{ position: 'absolute', bottom: '3%', right: '4%', width: 'clamp(60px, 8vw, 100px)', pointerEvents: 'none', zIndex: 1, opacity: 0.45 }} />
      <motion.img src="/decoradores/decor_static/3_lineas_siksak.png" alt="" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.9 }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'clamp(80px, 10vw, 150px)', pointerEvents: 'none', zIndex: 1, opacity: 0.15 }} />
      <motion.img src="/decoradores/decor_static/redondo_puteado.png" alt="" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 360 }} transition={{ opacity: { duration: 0.8, delay: 1 }, rotate: { duration: 18, repeat: Infinity, ease: 'linear' } }} style={{ position: 'absolute', top: '90%', left: '50%', width: 'clamp(70px, 8vw, 120px)', pointerEvents: 'none', zIndex: 1, opacity: 0.35 }} />
      <motion.img src="/decoradores/decor_static/fihura_extraña1.png" alt="" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 1.1 }} style={{ position: 'absolute', top: '65%', right: '8%', width: 'clamp(40px, 5vw, 70px)', pointerEvents: 'none', zIndex: 1, opacity: 0.35 }} />
      <motion.img src="/decoradores/decor_static/raya_tipo_mm_negra.png" alt="" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }} style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(100px, 15vw, 200px)', pointerEvents: 'none', zIndex: 1, opacity: 0.2 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#fff', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Explora Nuestra Institución
            </h2>
            <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, margin: '0 auto', borderRadius: '2px' }}></div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" style={{ marginBottom: '2rem' }}>
          {links
            ?.filter((link) => link.estado === 1)
            .map((link, index) => {
              const imageUrl = getImageUrl(link.imagen);
              const isEven = index % 2 === 0;
              const cardBg = isEven ? `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` : `linear-gradient(135deg, ${colors.secondary}20, ${colors.primary}20)`;
              const cardOverlay = isEven ? `linear-gradient(135deg, ${colors.primary}cc 0%, ${colors.secondary}cc 100%)` : `linear-gradient(135deg, ${colors.secondary}cc 0%, ${colors.primary}cc 100%)`;

              return (
                <FadeIn key={link.id_link} delay={index * 0.08}>
                  <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3, ease: 'easeOut' }} style={{ height: '100%' }}>
                    <Tilt
                      tiltMaxAngleX={8} tiltMaxAngleY={8} perspective={1200} scale={1.02} transitionSpeed={1200}
                      glareEnable glareMaxOpacity={0.15} glareColor="#ffffff" glarePosition="all"
                      style={{ height: '100%' }}
                    >
                      <a
                        href={link.url_link} target="_blank" rel="noopener noreferrer" className="group"
                        style={{
                          borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
                          cursor: 'pointer', position: 'relative', minHeight: 'clamp(280px, 40vw, 360px)', background: cardBg,
                          textDecoration: 'none', display: 'block', height: '100%', transition: 'box-shadow 0.3s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.25)'; }}
                      >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: cardOverlay, opacity: 0.85, zIndex: 0, overflow: 'hidden' }}>
                          {link.imagen && (
                            <img src={imageUrl} alt={link.nombre} className="transition-transform duration-700 ease-out group-hover:scale-125" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
                          )}
                        </div>

                        {/* Línea superior */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${isEven ? colors.primary : colors.secondary}, transparent)`, zIndex: 1, opacity: 0.8 }}></div>

                        <div style={{ position: 'relative', zIndex: 1, padding: '2.25rem 1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'clamp(280px, 40vw, 360px)', textAlign: 'center', color: '#fff' }}>
                          <motion.div
                            whileHover={{ rotate: 360 }} transition={{ duration: 0.8, ease: 'easeInOut' }} className="transition-transform duration-500 group-hover:scale-110"
                            style={{
                              width: '80px', height: '80px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.2)',
                              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))', border: '2px solid rgba(255,255,255,0.3)',
                            }}
                          >
                            {link.imagen ? (
                              <img src={imageUrl} alt={link.nombre} style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
                            ) : (
                              <FiLink size={32} />
                            )}
                          </motion.div>
                          
                          {link.tipo && (
                            <span style={{ padding: '0.35rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', backdropFilter: 'blur(5px)' }}>
                              {link.tipo}
                            </span>
                          )}
                          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', lineHeight: 1.3 }}>
                            {link.nombre}
                          </h3>
                          <span
                            className="transition-transform duration-300 group-hover:translate-x-1"
                            style={{
                              padding: '0.8rem 1.75rem', background: '#fff', color: isEven ? colors.primary : colors.secondary,
                              borderRadius: '50px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease', marginTop: 'auto',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                          >
                            Acceder <FiExternalLink size={16} />
                          </span>
                        </div>
                      </a>
                    </Tilt>
                  </motion.div>
                </FadeIn>
              );
            })}
        </div>

        {!links?.length && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <p>No hay enlaces disponibles en este momento.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploraSection;
