import { motion } from 'framer-motion';
import { FaUserTie } from 'react-icons/fa';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa6';
import FadeIn from './FadeIn';
import type { Autoridad } from '../../lib/api';

const getImageUrl = (filename: string | null | undefined): string => {
  return filename || '';
};

interface AutoridadesSectionProps {
  autoridades: Autoridad[] | undefined;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

/**
 * -------------------------------------------------------------------
 * Componente AutoridadesSection
 * Renderiza la sección de autoridades de la carrera.
 * -------------------------------------------------------------------
 */
const AutoridadesSection = ({ autoridades = [], colors }: AutoridadesSectionProps) => {
  return (
    <section
      id="autoridades"
      style={{
        padding: 'clamp(3rem, 8vw, 6rem) 0',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 50%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '-120px', left: '-120px', width: 'clamp(200px, 30vw, 340px)', height: 'clamp(200px, 30vw, 340px)', borderRadius: '50%', background: `${colors.primary}18`, filter: 'blur(10px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-140px', right: '-100px', width: 'clamp(220px, 32vw, 380px)', height: 'clamp(220px, 32vw, 380px)', borderRadius: '50%', background: `${colors.secondary}18`, filter: 'blur(10px)', zIndex: 0 }}></div>

      {/* DECORADORES ESTÁTICOS ANIMADOS */}
      <style>{`
        .decorador-autoridad { position: absolute; pointer-events: none; z-index: 1; }
        @media (max-width: 768px) { .decorador-autoridad { opacity: 0.25 !important; } .decorador-hide-mobile { display: none; } }
        @media (max-width: 480px) { .decorador-autoridad { opacity: 0.15 !important; } }
        
        .autoridades-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 640px) { .autoridades-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; } }
        @media (min-width: 1024px) { .autoridades-grid { grid-template-columns: repeat(3, 1fr); gap: 2rem; } }
        @media (hover: none) { .autoridad-social-bar { opacity: 1 !important; transform: translateY(0) !important; } }
      `}</style>

      {/* ... decoradores ... */}
      <motion.img src="/Decoradores_gas_petroqumica/decoradoresestaticos/circulo.png" alt="" className="decorador-autoridad" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 1, rotate: 360 }} transition={{ opacity: { duration: 0.8, delay: 0.3 }, scale: { duration: 0.8, delay: 0.3 }, rotate: { duration: 25, repeat: Infinity, ease: 'linear' } }} style={{ top: '5%', left: '2%', width: 'clamp(40px, 6vw, 100px)' }} />
      <motion.div className="decorador-autoridad" style={{ position: 'absolute', top: '-15%', right: '-10%', width: 'clamp(250px, 35vw, 600px)', zIndex: 1 }}>
        <motion.img src="/decoradores/decor_static/tuerca_2.png" alt="" initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 0.7, rotate: 360 }} transition={{ opacity: { duration: 0.8, delay: 0.3 }, rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }} style={{ width: '100%', filter: `drop-shadow(0 0 20px ${colors.primary}40)` }} />
      </motion.div>
      <motion.div className="decorador-autoridad" style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: 'clamp(250px, 35vw, 600px)', zIndex: 1 }}>
        <motion.img src="/decoradores/decor_static/tuerca_2.png" alt="" initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 0.7, rotate: -360 }} transition={{ opacity: { duration: 0.8, delay: 0.5 }, rotate: { duration: 22, repeat: Infinity, ease: 'linear' } }} style={{ width: '100%', filter: `drop-shadow(0 0 20px ${colors.secondary}40)` }} />
      </motion.div>
      <motion.img src="/decoradores/decor_static/redondo_puteado.png" alt="" className="decorador-autoridad decorador-hide-mobile" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.4, scale: 1, rotate: 360 }} transition={{ opacity: { duration: 0.8, delay: 0.7 }, scale: { duration: 0.8, delay: 0.7 }, rotate: { duration: 22, repeat: Infinity, ease: 'linear' } }} style={{ top: '50%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(40px, 5vw, 90px)' }} />
      <motion.img src="/Decoradores_gas_petroqumica/decoradoresestaticos/cuadrado_punteado_rojo.png" alt="" className="decorador-autoridad decorador-hide-mobile" initial={{ opacity: 0 }} animate={{ opacity: 0.4, y: [0, -15, 0] }} transition={{ opacity: { duration: 0.8, delay: 0.5 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }} style={{ top: '4%', right: '3%', width: 'clamp(35px, 5vw, 80px)' }} />
      <motion.img src="/Decoradores_gas_petroqumica/decoradoresestaticos/objeto.png" alt="" className="decorador-autoridad decorador-hide-mobile" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.45, x: 0, y: [0, -12, 0] }} transition={{ opacity: { duration: 0.8, delay: 0.7 }, x: { duration: 0.8, delay: 0.7 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }} style={{ top: '30%', left: '1%', width: 'clamp(35px, 5vw, 80px)' }} />
      <motion.img src="/Decoradores_gas_petroqumica/decoradoresestaticos/objeto_combinado.png" alt="" className="decorador-autoridad decorador-hide-mobile" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 0.45, x: 0, y: [0, -14, 0] }} transition={{ opacity: { duration: 0.8, delay: 0.8 }, x: { duration: 0.8, delay: 0.8 }, y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }} style={{ top: '25%', right: '1%', width: 'clamp(35px, 5vw, 85px)' }} />
      <motion.img src="/Decoradores_gas_petroqumica/decoradoresestaticos/redondo_puntedo_rojo.png" alt="" className="decorador-autoridad" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 1, rotate: -360 }} transition={{ opacity: { duration: 0.8, delay: 0.6 }, scale: { duration: 0.8, delay: 0.6 }, rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }} style={{ top: '45%', left: '3%', width: 'clamp(50px, 7vw, 120px)' }} />
      <motion.img src="/Decoradores_gas_petroqumica/decoradoresestaticos/redondo_punteuado5.png" alt="" className="decorador-autoridad decorador-hide-mobile" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.45, scale: 1, rotate: 360 }} transition={{ opacity: { duration: 0.8, delay: 0.7 }, scale: { duration: 0.8, delay: 0.7 }, rotate: { duration: 28, repeat: Infinity, ease: 'linear' } }} style={{ top: '50%', right: '2%', width: 'clamp(45px, 6vw, 110px)' }} />
      {/* ... mas decoradores estaticos ...  */}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
            <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#0f172a', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Autoridades
            </h2>
            <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, margin: '0 auto', borderRadius: '2px' }}></div>
            <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: '#475569', maxWidth: '600px', margin: '1.5rem auto 0', padding: '0 1rem' }}>
              Conoce a las autoridades que lideran nuestra institución
            </p>
          </div>
        </FadeIn>

        <div className="autoridades-grid">
          {autoridades.map((autoridad, index) => {
            const fotoUrl = getImageUrl(autoridad.foto_autoridad);
            const barColor = index % 3 === 1 ? colors.secondary : colors.primary;
            const hasFacebook = autoridad.facebook_autoridad && autoridad.facebook_autoridad !== 'qweqwe';
            const hasCelular = autoridad.celular_autoridad && autoridad.celular_autoridad !== '234';

            return (
              <FadeIn key={autoridad.id_autoridad} delay={index * 0.08}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: index % 2 === 0 ? -8 : 8, x: index % 3 === 0 ? -60 : index % 3 === 1 ? 0 : 60, y: 40 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.1 }}
                  whileHover="hover"
                  style={{ height: '100%' }}
                >
                  <motion.div
                    variants={{ hover: { scale: 1.03, rotate: index % 2 === 0 ? -2 : 2, transition: { duration: 0.3, ease: 'easeOut' } } }}
                    style={{ borderRadius: '18px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(15,23,42,0.08)', background: '#fff', border: `2px solid ${barColor}30`, height: '100%', position: 'relative', transition: 'box-shadow 0.3s ease' }}
                  >
                    <motion.div
                      variants={{ hover: { y: -4, transition: { duration: 0.2 } } }}
                      style={{ position: 'relative', height: 'clamp(220px, 35vw, 360px)', overflow: 'hidden', background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)` }}
                    >
                      {fotoUrl ? (
                        <motion.img src={fotoUrl} alt={autoridad.nombre_autoridad} variants={{ hover: { scale: 1.1, transition: { duration: 0.5 } } }} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` }}>
                          <FaUserTie size={72} color={barColor} opacity={0.35} />
                        </div>
                      )}
                      
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}></div>

                      {(hasFacebook || hasCelular) && (
                        <motion.div
                          className="autoridad-social-bar"
                          initial={{ y: '100%', opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: '0.85rem', justifyContent: 'center', padding: '1.1rem' }}
                        >
                          {hasFacebook && (
                            <a href={`https://facebook.com/${autoridad.facebook_autoridad}`} target="_blank" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                              <FaFacebookF size={17} color="#fff" />
                            </a>
                          )}
                          {hasCelular && (
                            <a href={`https://wa.me/${autoridad.celular_autoridad}`} target="_blank" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                              <FaWhatsapp size={19} color="#fff" />
                            </a>
                          )}
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div variants={{ hover: { y: -2, transition: { duration: 0.2 } } }} style={{ padding: 'clamp(1rem, 3vw, 1.75rem)', textAlign: 'center', background: '#fff' }}>
                      <h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, color: '#1e293b', margin: '0 0 0.6rem', lineHeight: 1.3 }}>{autoridad.nombre_autoridad}</h3>
                      <p style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', fontWeight: 600, color: barColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{autoridad.cargo_autoridad}</p>
                    </motion.div>
                    
                    <motion.div variants={{ hover: { scaleX: 1.05, transition: { duration: 0.3 } } }} style={{ height: '4px', background: barColor }} />
                  </motion.div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>

        {!autoridades.length && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p>No hay autoridades registradas en este momento.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AutoridadesSection;
